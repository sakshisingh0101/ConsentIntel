import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Clock, AlertTriangle, Shield, MousePointer2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function TimelinePage() {
    const { appId } = useParams();
    const [events, setEvents] = useState([]);
    const [appInfo, setAppInfo] = useState(null); // We need app name etc.

    useEffect(() => {
        fetchData();
    }, [appId]);

    const fetchData = async () => {
        try {
            const eventsRes = await axios.get(`${API_URL}/timeline/${appId}`);
            setEvents(eventsRes.data);

            // Also fetch app details?? We might need a generic GET /apps/:id but we have /apps.
            // Let's just find it from GET /apps for now or rely on events having info?
            // events don't have app name.
            // Let's fast fetch apps list.
            const appsRes = await axios.get(`${API_URL}/apps`);
            const found = appsRes.data.find(a => a.id === appId);
            setAppInfo(found);
        } catch (err) {
            console.error(err);
        }
    };

    const simulateActivity = async (type) => {
        try {
            await axios.post(`${API_URL}/simulate-activity`, { appId, type });
            fetchData(); // Refresh
        } catch (err) {
            console.error("Simulation failed", err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold">Consent Timeline</h2>
                    <p className="text-muted-foreground">
                        History of permission access and risk events for <span className="font-semibold text-foreground">{appInfo?.name || appId}</span>.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase text-right opacity-50">Simulation Controls</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => simulateActivity('normal')}
                            className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded border"
                        >
                            Normal Access
                        </button>
                        <button
                            onClick={() => simulateActivity('access_sensitive')}
                            className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20 px-3 py-1 rounded border"
                        >
                            Trigger Mic Access
                        </button>
                        <button
                            onClick={() => simulateActivity('dormant_access')}
                            className="text-xs bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20 px-3 py-1 rounded border"
                        >
                            Trigger Dormant Leak
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-12">
                {events.map((event) => (
                    <TimelineEvent key={event.id} event={event} />
                ))}
                {events.length === 0 && <div className="ml-6 text-muted-foreground">No events recorded.</div>}
            </div>
        </div>
    );
}

function TimelineEvent({ event }) {
    const { date, type, description, severity } = event;

    let icon = <Clock className="h-4 w-4" />;
    let colorClass = "bg-muted text-muted-foreground";

    if (severity === 'warning') {
        icon = <AlertTriangle className="h-4 w-4" />;
        colorClass = "bg-yellow-100 text-yellow-600 border-yellow-200";
    } else if (severity === 'alert') {
        icon = <AlertTriangle className="h-4 w-4" />;
        colorClass = "bg-red-100 text-red-600 border-red-200";
    } else if (type === 'install') {
        icon = <Shield className="h-4 w-4" />;
        colorClass = "bg-blue-100 text-blue-600 border-blue-200";
    }

    return (
        <div className="ml-6 relative">
            <div className={`absolute -left-[33px] h-8 w-8 rounded-full border flex items-center justify-center ${colorClass}`}>
                {icon}
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm capitalize">{type.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground font-mono">{new Date(date).toLocaleString()}</span>
                </div>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    );
}
