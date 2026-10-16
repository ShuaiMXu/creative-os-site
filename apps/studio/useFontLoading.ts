import { useEffect, useState } from "react";
import { fontsInStack, type OpenFont } from "../../packages/font-library";

const requests = new Map<string, Promise<void>>();
function loadFont(font: OpenFont): Promise<void> {
  const existing = requests.get(font.id);
  if (existing) return existing;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = font.stylesheet;
  link.dataset.openFont = font.id;
  const request = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(Error("Font loading timed out")),
      15000,
    );
    link.onerror = () => {
      clearTimeout(timeout);
      reject(Error("Font stylesheet unavailable"));
    };
    link.onload = () => {
      Promise.all(
        [400, 700].map((weight) =>
          document.fonts.load(
            `${weight} 16px "${font.family}"`,
            "设计 Aa 0123456789",
          ),
        ),
      )
        .then((faces) => {
          if (faces.some((group) => !group.length))
            throw Error("No font faces loaded");
          clearTimeout(timeout);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    };
    document.head.append(link);
  }).catch((error) => {
    link.remove();
    requests.delete(font.id);
    throw error;
  });
  requests.set(font.id, request);
  return request;
}

export function useFontLoading(stack: string | string[]) {
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState<
    "system" | "loading" | "ready" | "error"
  >("system");
  const fonts = [
    ...new Map(
      (Array.isArray(stack) ? stack : [stack])
        .flatMap(fontsInStack)
        .map((font) => [font.id, font]),
    ).values(),
  ];
  const ids = fonts
    .map((font) => font.id)
    .sort()
    .join(",");
  useEffect(() => {
    let active = true;
    if (!fonts.length) {
      setStatus("system");
      return;
    }
    setStatus("loading");
    Promise.all(fonts.map(loadFont)).then(
      () => {
        if (active) setStatus("ready");
      },
      () => {
        if (active) setStatus("error");
      },
    );
    return () => {
      active = false;
    };
  }, [ids, retry]);
  return { status, retry: () => setRetry((value) => value + 1) };
}
