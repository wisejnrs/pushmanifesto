"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';

interface MermaidDiagramProps {
    code: string;
    width?: number;
    height?: number;
}

export default function MermaidDiagram({ code, width, height }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [renderState, setRenderState] = useState<{
        status: 'idle' | 'rendering' | 'success' | 'error';
        svg: string;
        error: string;
    }>({
        status: 'idle',
        svg: '',
        error: ''
    });

    // Memoize the cleaned code to prevent unnecessary re-renders
    const cleanCode = useMemo(() => code.trim(), [code]);

    // Handle client-side hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !cleanCode) {
            if (!cleanCode) {
                setRenderState({
                    status: 'error',
                    svg: '',
                    error: 'No diagram code provided'
                });
            }
            return;
        }

        let cancelled = false;

        const renderDiagram = async () => {
            setRenderState(prev => ({ ...prev, status: 'rendering' }));

            try {
                // Small delay to prevent flickering
                await new Promise(resolve => setTimeout(resolve, 50));

                if (cancelled) return;

                // Import mermaid only when needed
                const { default: mermaid } = await import('mermaid');

                if (cancelled) return;

                // Configure mermaid with better settings for stability
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose',
                    fontFamily: 'inherit',
                    suppressErrorRendering: true
                });

                const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, cleanCode);

                if (!cancelled) {
                    setRenderState({
                        status: 'success',
                        svg: renderedSvg,
                        error: ''
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setRenderState({
                        status: 'error',
                        svg: '',
                        error: err instanceof Error ? err.message : 'Rendering failed'
                    });
                }
            }
        };

        void renderDiagram();

        return () => {
            cancelled = true;
        };
    }, [isClient, cleanCode]);

    // Show consistent loading state during SSR and initial client render
    if (!isClient || renderState.status === 'idle' || renderState.status === 'rendering') {
        return (
            <div className="my-6 p-8 bg-muted/30 rounded-lg border transition-opacity duration-300">
                <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-sm text-muted-foreground">
                        {!isClient ? 'Loading...' : 'Rendering diagram...'}
                    </p>
                </div>
            </div>
        );
    }

    if (renderState.status === 'error') {
        return (
            <div className="my-6 p-4 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border overflow-x-auto transition-opacity duration-300 opacity-100">
                <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground">📊 Mermaid Diagram (Code View)</div>
                </div>
                <pre className="bg-muted/50 p-4 rounded text-sm overflow-auto">
                    <code className="text-foreground">{cleanCode}</code>
                </pre>
                <div className="text-center mt-4">
                    <div className="text-xs text-red-400">Error: {renderState.error}</div>
                </div>
            </div>
        );
    }

    const containerStyle = width && height
        ? { width: `${width}px`, height: `${height}px`, maxWidth: '100%', minHeight: 'auto' }
        : { minHeight: '200px' };

    return (
        <div className={width && height ? "my-6 mx-auto" : "my-6 p-4 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border overflow-x-auto transition-opacity duration-300 opacity-100"} style={width && height ? { width: `${width}px`, maxWidth: '100%' } : {}}>
            {width && height ? (
                <div
                    className="rounded-lg border shadow-2xl overflow-hidden bg-gradient-to-br from-muted/10 to-muted/5"
                    style={{ width: '100%', height: `${height}px` }}
                >
                    <div
                        ref={containerRef}
                        className="flex justify-center items-center w-full h-full p-4"
                        dangerouslySetInnerHTML={{ __html: renderState.svg }}
                    />
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="flex justify-center"
                    style={containerStyle}
                    dangerouslySetInnerHTML={{ __html: renderState.svg }}
                />
            )}
        </div>
    );
}