import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Smartphone, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dotenv from 'dotenv';
dotenv.config();
const API_URL = process.env.VITE_API_URL;;

export default function RiskPreview() {
    const [apps, setApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await axios.get(`${API_URL}/apps`);
            setApps(res.data);
        } catch (err) {
            console.error("Failed to fetch apps", err);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedApp) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/preview-risk`, { appId: selectedApp.id });
            setAnalysis(res.data);
        } catch (err) {
            console.error("Analysis failed", err);
        }
        setLoading(false);
    };

    const handleInstall = async () => {
        if (!selectedApp) return;
        try {
            await axios.post(`${API_URL}/install-app`, { appId: selectedApp.id });
            navigate('/dashboard');
        } catch (err) {
            alert("Installation failed or app already installed.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Consent Risk Preview</h2>
                <p className="text-muted-foreground">Select an app to analyze its risk profile before installing.</p>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Mock App to Analyze</label>
                    <select
                        className="w-full p-3 rounded-md bg-slate-900 text-white border border-slate-700 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                        onChange={(e) => {
                            const app = apps.find(a => a.id === e.target.value);
                            setSelectedApp(app);
                            setAnalysis(null);
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled className="bg-slate-900 text-white">-- Choose an App --</option>
                        {apps.map(app => (
                            <option key={app.id} value={app.id} className="bg-slate-900 text-white">
                                {app.name} ({app.category})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedApp && (
                    <div className="grid md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Requested Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedApp.requestedPermissions.map(p => (
                                    <span key={p} className="px-2 py-1 bg-background border rounded text-xs font-mono">{p}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Policy Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedApp.policyKeywords.map(k => (
                                    <span key={k} className="px-2 py-1 bg-background border rounded text-xs font-mono text-muted-foreground">{k}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={!selectedApp || loading}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                    {loading ? "Analyzing..." : "Analyze Risk"}
                </button>
            </div>

            {analysis && selectedApp && (
                <ConsentSafetyCard
                    app={selectedApp}
                    analysis={analysis}
                    onInstall={handleInstall}
                />
            )}
        </div>
    );
}

function ConsentSafetyCard({ app, analysis, onInstall }) {
    const { level, score, reasons, recommendation } = analysis;

    const colorMap = {
        LOW: "bg-green-500/10 text-green-600 border-green-200",
        MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
        HIGH: "bg-red-500/10 text-red-600 border-red-200"
    };

    const iconMap = {
        LOW: <CheckCircle className="h-8 w-8 text-green-600" />,
        MEDIUM: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
        HIGH: <AlertTriangle className="h-8 w-8 text-red-600" />
    };

    return (
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className={`p-6 border-b flex items-start justify-between ${colorMap[level]}`}>
                <div className="flex items-center gap-4">
                    {iconMap[level]}
                    <div>
                        <h3 className="text-2xl font-bold">{level} RISK DETECTED</h3>
                        <p className="text-sm font-medium opacity-90">Safety Score: {100 - score}/100</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70">Analysis for</span>
                    <div className="font-bold text-lg">{app.name}</div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> Why this score?
                    </h4>
                    <ul className="space-y-1 ml-6 list-disc text-sm text-muted-foreground">
                        {reasons.length > 0 ? reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                        )) : <li>No significant risk factors found.</li>}
                    </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-bold text-sm mb-1">RECOMMENDATION</h4>
                    <p className="text-sm">{recommendation}</p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={onInstall}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-bold hover:bg-primary/90"
                    >
                        Simulate Install & Monitor
                    </button>
                </div>
            </div>
        </div>
    );
}
