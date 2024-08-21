import * as React from "react";
import * as Pages from "@/components/Pages";
import * as Paper from "@/components/PaperContainer";
import * as Icons from "@tabler/icons-react";

import { Logo } from "@/layouts/DefaultLayout/Logo";
import { Colors } from "./Colors";
import { Buttons } from "./Buttons";
import { Link } from "@/components/Link";
import { Menus } from "./Menus";

export const loader = Pages.emptyLoader;

export function Page() {
  return (
    <Pages.Page title={"Design System"}>
      <Paper.Root size="large">
        <BackToLobbyLink />
        <Paper.Body>
          <TitleRow />
          <Colors />
          <Buttons />
          <Menus />
        </Paper.Body>
      </Paper.Root>
    </Pages.Page>
  );
}

function BackToLobbyLink() {
  return (
    <div className="flex items-center mb-4 mt-12">
      <Link to={"/"}>
        <Icons.IconArrowLeft className="text-content-dimmed inline mr-2" size={16} />
        Back to the Lobby
      </Link>
    </div>
  );
}

function TitleRow() {
  return (
    <div className="flex items-center gap-4 border-b border-stroke-base pb-6">
      <Logo width="30px" height="30px" />
      <div className="text-content-accent text-2xl font-semibold">Operately Design System</div>
    </div>
  );
}
