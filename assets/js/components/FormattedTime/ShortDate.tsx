import React from "react";
import { useTranslation } from "react-i18next";

function isCurrentYear(date: Date) {
  return date.getFullYear() === new Date().getFullYear();
}

export default function ShortDate({ time }: { time: Date }): JSX.Element {
  const { t } = useTranslation();

  let params = {
    val: time,
    formatParams: {
      val: {
        month: "short",
        day: "numeric",
      },
    },
  };

  if (!isCurrentYear(time)) {
    params["formatParams"]["val"]["year"] = "numeric";
  }

  return <>{t("intlDateTime", params)}</>;
}
