import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, Check, X, Shield, Info } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function RiskExplanation() {
    const { appId } = useParams();
    const [app, setApp] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [runtime, setRuntime] = useState(null);

    useEffect(() => {
        fetchData();
    }, [appId]);

    const fetchData = async () => {
        try {
            const appsRes = await axios.get(`${API_URL}/apps`);
            const foundApp = appsRes.data.find(a => a.id === appId);
            setApp(foundApp);

            if (foundApp) {
                // Get Static Analysis
                const riskRes = await axios.post(`${API_URL}/preview-risk`, { appId: foundApp.id });
                setAnalysis(riskRes.data);

                // Get Runtime Analysis
                try {
                    const runtimeRes = await axios.get(`${API_URL}/runtime-risk/${appId}`);
                    setRuntime(runtimeRes.data);
                } catch (e) {
                    // maybe not installed or other error, ignore for static view
                    console.warn("Runtime risk not available", e);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!app || !analysis) return <div className="p-8 text-center">Loading risk profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <Link to="/dashboard" className="text-sm font-medium hover:underline text-muted-foreground">&larr; Back to Dashboard</Link>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: App Info & Score */}
                <div className="md:w-1/3 space-y-6">
                    <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <Shield className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="font-bold text-2xl">{app.name}</h1>
                        <p className="text-muted-foreground">{app.category}</p>

                        <div className="mt-8">
                            <div className="text-sm opacity-70 uppercase font-bold tracking-wider">Current Trust Score</div>
                            <div className="text-6xl font-extrabold my-2 text-foreground">
                                {runtime ? 100 - runtime.riskScore : (100 - analysis.score)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Out of 100. Higher is safer.
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg text-sm border">
                        <h4 className="font-bold mb-2">Policy Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                            {app.policyKeywords.map(k => (
                                <span key={k} className="px-2 py-1 bg-background border rounded text-xs">{k}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Breakdown */}
                <div className="md:w-2/3 space-y-6">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-primary" /> Risk Factor Breakdown
                        </h3>

                        <div className="space-y-4">
                            {/* Static Factors */}
                            <RiskItem
                                title="High Risk Permissions"
                                desc="Requests access to sensitive user data (Mic, Location, Contacts)."
                                score={30}
                                active={analysis.reasons.some(r => r.includes("high-risk permissions"))}
                            />
                            <RiskItem
                                title="Category Mismatch"
                                desc={`App category '${app.category}' should not require these permissions.`}
                                score={25}
                                active={analysis.reasons.some(r => r.includes("mismatch"))}
                            />
                            <RiskItem
                                title="Data Sharing Policy"
                                desc="Terms allow sharing data with 3rd party partners."
                                score={20}
                                active={analysis.reasons.some(r => r.includes("partners") || r.includes("advertising"))}
                            />
                            <RiskItem
                                title="Long-term Retention"
                                desc="Data is retained indefinitely or for long periods."
                                score={15}
                                active={analysis.reasons.some(r => r.includes("retain"))}
                            />

                            {/* Runtime Factors */}
                            {runtime && (
                                <RiskItem
                                    title="Excessive Runtime Access"
                                    desc="App accessed sensitive data >10 times in a week."
                                    score={25}
                                    active={runtime.accessCount > 10} // Simplified check based on logic rule
                                    isRuntime
                                />
                            )}

                            {runtime && (
                                <RiskItem
                                    title="Dormant Access (Background)"
                                    desc="App accessed data while not in use by user."
                                    score={20}
                                    active={100 - runtime.riskScore < 100 - analysis.score} // Heuristic: if runtime risk > static risk
                                    isRuntime
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-200 p-4 rounded-lg text-blue-800">
                        <h4 className="font-bold flex items-center gap-2 mb-1">
                            <Info className="h-4 w-4" /> Final Recommendation
                        </h4>
                        <p className="text-sm">
                            {analysis.recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskItem({ title, desc, score, active, isRuntime }) {
    if (!active) {
        return (
            <div className="flex justify-between items-start opacity-50 grayscale hover:grayscale-0 transition-all p-2 rounded hover:bg-muted/50 cursor-default">
                <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                        <div className="font-bold text-sm strikethrough">{title}</div>
                        <div className="text-xs">{desc}</div>
                    </div>
                </div>
                <span className="text-xs font-mono text-green-600 font-bold">PASSED</span>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-start bg-red-500/5 p-3 rounded-lg border border-red-100">
            <div className="flex gap-3">
                <X className="h-5 w-5 text-red-500 mt-1" />
                <div>
                    <div className="font-bold text-sm text-red-900 flex items-center gap-2">
                        {title}
                        {isRuntime && <span className="text-[10px] bg-red-200 text-red-800 px-1 rounded uppercase">Runtime</span>}
                    </div>
                    <div className="text-xs text-red-700/80">{desc}</div>
                </div>
            </div>
            <span className="text-sm font-mono text-red-600 font-bold">+{score} RISK</span>
        </div>
    );
}
