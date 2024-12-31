import React from "react";

import * as Reactions from "@/models/reactions";
import * as Pages from "@/components/Pages";
import * as Paper from "@/components/PaperContainer";

import RichContent from "@/components/RichContent";
import { Spacer } from "@/components/Spacer";
import { assertPresent } from "@/utils/assertions";
import { ReactionList, useReactionsForm } from "@/features/Reactions";
import { CommentSection, useComments } from "@/features/CommentSection";
import { CurrentSubscriptions } from "@/features/Subscriptions";
import { useClearNotificationsOnLoad } from "@/features/notifications";
import { NestedFolderNavigation } from "@/features/ResourceHub";

import { useLoadedData } from "./loader";
import { Options } from "./Options";
import { DocumentTitle } from "@/features/documents/DocumentTitle";

export function Page() {
  const { document } = useLoadedData();

  assertPresent(document.notifications, "notifications must be present in document");
  useClearNotificationsOnLoad(document.notifications);

  return (
    <Pages.Page title={document.name!}>
      <Paper.Root size="large">
        <Navigation />

        <Paper.Body minHeight="600px" className="lg:px-28">
          <Options />

          <Title />
          <Body />
          <DocumentReactions />
          <DocumentComments />
          <DocumentSubscriptions />
        </Paper.Body>
      </Paper.Root>
    </Pages.Page>
  );
}

function Navigation() {
  const { document } = useLoadedData();

  assertPresent(document.resourceHub, "resourceHub must be present in document");
  assertPresent(document.resourceHub.space, "space must be present in document.resourceHub");
  assertPresent(document.pathToDocument, "pathToDocument must be present in document");

  return (
    <Paper.Navigation testId="navigation">
      <Paper.NavSpaceLink space={document.resourceHub.space} />
      <Paper.NavSeparator />
      <Paper.NavResourceHubLink resourceHub={document.resourceHub} />
      <NestedFolderNavigation folders={document.pathToDocument} />
    </Paper.Navigation>
  );
}

function Title() {
  const { document } = useLoadedData();

  assertPresent(document.author, "author must be present in document");

  return (
    <DocumentTitle
      title={document.name!}
      author={document.author}
      publishedAt={document.insertedAt!}
      state="published"
    />
  );
}

function Body() {
  const { document } = useLoadedData();

  return (
    <>
      <Spacer size={4} />
      <RichContent jsonContent={document.content!} className="text-md sm:text-lg" />
    </>
  );
}

function DocumentReactions() {
  const { document } = useLoadedData();

  assertPresent(document.permissions?.canCommentOnDocument, "permissions must be present in document");

  const reactions = document.reactions!.map((r) => r!);
  const entity = Reactions.entity(document.id!, "resource_hub_document");
  const addReactionForm = useReactionsForm(entity, reactions);

  return (
    <>
      <Spacer size={2} />
      <ReactionList size={24} form={addReactionForm} canAddReaction={document.permissions.canCommentOnDocument} />
    </>
  );
}

function DocumentComments() {
  const { document } = useLoadedData();
  const commentsForm = useComments({ parentType: "resource_hub_document", document: document });

  assertPresent(document.permissions?.canCommentOnDocument, "permissions must be present in document");

  return (
    <>
      <Spacer size={4} />
      <div className="border-t border-stroke-base mt-8" />
      <CommentSection
        form={commentsForm}
        refresh={() => {}}
        commentParentType="resource_hub_document"
        canComment={document.permissions.canCommentOnDocument}
      />
    </>
  );
}

function DocumentSubscriptions() {
  const { document } = useLoadedData();
  const refresh = Pages.useRefresh();

  assertPresent(document.subscriptionList, "subscriptionList should be present in document");

  return (
    <>
      <div className="border-t border-stroke-base mt-16 mb-8" />

      <CurrentSubscriptions
        potentialSubscribers={document.potentialSubscribers!}
        subscriptionList={document.subscriptionList}
        name="document"
        type="resource_hub_document"
        callback={refresh}
      />
    </>
  );
}
