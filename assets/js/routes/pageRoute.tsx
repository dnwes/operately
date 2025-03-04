import React from "react";
import { AxiosError } from "axios";

import nprogress from "nprogress";
import { setDevData } from "@/features/DevBar/useDevBarData";
import { redirect } from "react-router-dom";

type Loader = ({ params }: { params: any }) => Promise<any>;

interface Options {
  auth?: boolean;
}

const defaultOptions: Options = {
  auth: true,
};

export function pageRoute(path: string, pageModule: any, options: Options = {}) {
  options = { ...defaultOptions, ...options };

  const Element = pageModule.Page;
  const loader = pageModule.loader;

  return {
    path: path,
    loader: pageLoader(path, pageModule.name, loader, options),
    element: <Element />,
  };
}

function pageLoader(path: string, pageName: string, loader: Loader, options: Options = {}) {
  return async (req: any) => {
    if (options.auth) {
      checkAuth();
    }

    try {
      setDevData({ networkRequests: 0 });

      const start = performance.now();
      startProgressIndicator(req);

      const data = await loader(req);

      stopProgressIndicator();
      const end = performance.now();

      setDevData({ pageName: pageName, loadTime: end - start });

      return data;
    } catch (error) {
      stopProgressIndicator();
      redirectToLoginIfUnauthorized(error);

      if (error.status === 302) {
        // This is a redirect triggered by the page loader, just throw it to let the router handle it
        throw error;
      } else {
        console.log("Error loading page", path, error);
        throw error;
      }
    }
  };
}

function startProgressIndicator(req: any) {
  if (req.request.url === document.URL) {
    nprogress.start();
  }
}

function stopProgressIndicator() {
  if (nprogress.isStarted()) {
    nprogress.done();
  }
}

function redirectToLoginIfUnauthorized(error: any) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      throw redirect("/log_in");
    }
  }
}

export function checkAuth() {
  if (!window.appConfig.configured) {
    stopProgressIndicator();
    throw redirect("/setup");
  }

  if (!window.appConfig.account?.id) {
    stopProgressIndicator();

    if (window.location.pathname === "/") {
      throw redirect("/log_in");
    } else {
      throw redirect("/log_in?redirect_to=" + encodeURIComponent(window.location.pathname));
    }
  }
}
