"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  ArrowUp,
} from "lucide-react";
declare global {
  interface Window {
    pdfjsLib?: {
      getDocument: (src: string) => { promise: Promise<PDFDocumentProxy> };
      GlobalWorkerOptions: {
        workerSrc: string;
      };
    };
  }
}
interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}
interface PDFPageProxy {
  getViewport: (options: { scale: number }) => PDFViewport;
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFViewport;
  }) => { promise: Promise<void> };
}
interface PDFViewport {
  width: number;
  height: number;
}
interface ScrollablePDFViewerProps {
  pdfUrl: string;
  title: string;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
}
export function ScrollablePDFViewer({
  pdfUrl,
  title,
  className = "",
  maxWidth = "900px",
  maxHeight = "700px",
}: ScrollablePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(0.7);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageImages, setPageImages] = useState<{ [key: number]: string }>({});
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVisiblePage, setCurrentVisiblePage] = useState(1);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  // Загрузка PDF.js
  useEffect(() => {
    const loadPDFJS = async () => {
      if (window.pdfjsLib) return;
      try {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        if (window.pdfjsLib?.GlobalWorkerOptions) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        await loadPDF();
      } catch (error) {
        console.error("Ошибка загрузки PDF.js:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    loadPDFJS();
  }, []);
  const loadPDF = async () => {
    try {
      setIsLoading(true);
      if (!window.pdfjsLib) {
        throw new Error("PDF.js не загружен");
      }
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setIsLoading(false);
      // Загружаем первые несколько страниц
      for (let i = 1; i <= Math.min(3, pdf.numPages); i++) {
        renderPage(i, pdf);
      }
    } catch (error) {
      console.error("Ошибка загрузки PDF:", error);
      setHasError(true);
      setIsLoading(false);
    }
  };
  const renderPage = useCallback(async (pageNum: number, pdf?: PDFDocumentProxy) => {
    if (pageImages[pageNum] || loadingPages.has(pageNum)) return;
    const pdfDoc = pdf || pdfDocRef.current;
    if (!pdfDoc) return;
    try {
      setLoadingPages((prev) => new Set(prev).add(pageNum));
      const page = await pdfDoc.getPage(pageNum);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Не удалось получить контекст canvas");
      }
      const viewport = page.getViewport({ scale: 2.0 }); // Высокое качество
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      const imageUrl = canvas.toDataURL("image/png", 0.9);
      setPageImages((prev) => ({ ...prev, [pageNum]: imageUrl }));
      setLoadingPages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(pageNum);
        return newSet;
      });
    } catch (error) {
      console.error("Ошибка рендеринга страницы:", error);
      setLoadingPages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(pageNum);
        return newSet;
      });
    }
  }, [pageImages, loadingPages]);
  // Intersection Observer для lazy loading страниц
  useEffect(() => {
    if (!scrollContainerRef.current || numPages === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pageNum = Number(entry.target.getAttribute("data-page"));
          if (entry.isIntersecting) {
            // Загружаем текущую страницу и соседние
            for (
              let i = Math.max(1, pageNum - 1);
              i <= Math.min(numPages, pageNum + 2);
              i++
            ) {
              if (!pageImages[i] && !loadingPages.has(i)) {
                renderPage(i);
              }
            }
            // Обновляем текущую видимую страницу
            if (entry.intersectionRatio > 0.5) {
              setCurrentVisiblePage(pageNum);
            }
          }
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px",
        threshold: [0, 0.5, 1],
      },
    );
    // Наблюдаем за всеми страницами
    for (const ref of Object.values(pageRefs.current)) {
      if (ref) observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [numPages, pageImages, loadingPages, renderPage]);
  const changeScale = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const scrollToPage = (pageNum: number) => {
    const pageRef = pageRefs.current[pageNum];
    if (pageRef && scrollContainerRef.current) {
      pageRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const retryLoad = () => {
    setHasError(false);
    setIsLoading(true);
    setPageImages({});
    setLoadingPages(new Set());
    loadPDF();
  };
  if (hasError) {
    return (
      <Card className={`glass border-2 shadow-lg ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Ошибка загрузки PDF
              </h3>
              <p className="text-muted-foreground mb-4">
                Не удалось загрузить документ. Попробуйте обновить страницу.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={retryLoad} variant="default">
                <RotateCcw className="h-4 w-4 mr-2" />
                Попробовать снова
              </Button>
              <Button asChild variant="outline">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть в браузере
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={pdfUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""} ${className}`}
    >
      <Card className="glass border-2 shadow-lg h-full">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header с управлением */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <FileText className="h-3 w-3 mr-1" />
                {title}
              </Badge>
              {numPages > 0 && (
                <div className="text-sm text-muted-foreground">
                  Страница {currentVisiblePage} из {numPages}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Масштаб */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeScale(scale - 0.2)}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeScale(scale + 0.2)}
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {/* Наверх */}
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                title="В начало документа"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              {/* Полноэкранный режим */}
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              {/* Внешние ссылки */}
              <Button asChild variant="outline" size="sm">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={pdfUrl} download>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          {/* Миниатюры страниц для быстрой навигации */}
          {numPages > 1 && !isFullscreen && (
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {Array.from({ length: Math.min(numPages, 15) }, (_, i) => (
                <button
                  key={`page-${i + 1}`}
                  onClick={() => scrollToPage(i + 1)}
                  className={`flex-shrink-0 w-8 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105 ${
                    currentVisiblePage === i + 1
                      ? "border-primary bg-primary/10 text-primary shadow-lg"
                      : "border-muted hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {numPages > 15 && (
                <div className="flex-shrink-0 w-8 h-12 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  ...
                </div>
              )}
            </div>
          )}
          {/* Область прокрутки PDF */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4"
            style={{
              maxHeight: isFullscreen ? "calc(100vh - 250px)" : maxHeight,
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary" />
                <div className="text-center">
                  <p className="font-medium">Загрузка PDF...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Подготавливаем документ для просмотра
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                {Array.from({ length: numPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <div
                      key={pageNum}
                      ref={(el) => {
                        if (el) pageRefs.current[pageNum] = el;
                      }}
                      data-page={pageNum}
                      className="relative"
                    >
                      {/* Номер страницы */}
                      <div className="absolute -top-6 left-0 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded z-10">
                        Страница {pageNum}
                      </div>
                      {pageImages[pageNum] ? (
                        <img
                          src={pageImages[pageNum]}
                          alt={`Страница ${pageNum}`}
                          className="shadow-2xl rounded-lg border border-border/20 transition-transform duration-200"
                          style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "center center",
                            maxWidth: isFullscreen ? "none" : maxWidth,
                          }}
                        />
                      ) : loadingPages.has(pageNum) ? (
                        <div
                          className="flex items-center justify-center bg-muted/20 rounded-lg border border-border/20"
                          style={{
                            width: isFullscreen ? "800px" : maxWidth,
                            height: "600px",
                          }}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary" />
                            <p className="text-sm text-muted-foreground">
                              Загрузка страницы {pageNum}...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center bg-muted/10 rounded-lg border border-dashed border-border/50"
                          style={{
                            width: isFullscreen ? "800px" : maxWidth,
                            height: "600px",
                          }}
                        >
                          <p className="text-sm text-muted-foreground">
                            Страница {pageNum} загрузится при прокрутке
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Footer с информацией */}
          {numPages > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>
                  Страница {currentVisiblePage} из {numPages} • Прокрутите для
                  просмотра
                </span>
              </div>
              <div>Масштаб: {Math.round(scale * 100)}%</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
