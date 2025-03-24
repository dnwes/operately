import React from "react";

import * as Paper from "@/components/PaperContainer";
import * as Pages from "@/components/Pages";
import * as Discussions from "@/models/discussions";

import { PrimaryButton, GhostButton } from "@/components/Buttons";
import { Form, FormState, useForm } from "@/features/DiscussionForm";
import { Paths } from "@/routes/paths";
import { Link } from "@/components/Link";

interface LoaderResult {
  discussion: Discussions.Discussion;
}

export async function loader({ params }): Promise<LoaderResult> {
  return {
    discussion: await Discussions.getDiscussion({
      id: params.id,
      includeSpace: true,
    }).then((d) => d.discussion!),
  };
}

export function Page() {
  const { discussion } = Pages.useLoadedData<LoaderResult>();

  const form = useForm({
    discussion: discussion,
    space: discussion.space!,
    mode: "edit",
  });

  return (
    <Pages.Page title="Edit Discussion" testId="discussion-edit-page">
      <Paper.Root>
        <Navigation space={discussion.space!} />

        <Paper.Body>
          <Form form={form} />

          <Submit form={form} />
        </Paper.Body>
      </Paper.Root>
    </Pages.Page>
  );
}

function Submit({ form }: { form: FormState }) {
  return (
    <Paper.DimmedSection>
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2">
            <SaveChanges form={form} />
            <PublishNow form={form} />
          </div>

          <div className="mt-4">
            Or, <CancelLink form={form} />
          </div>
        </div>
      </div>
    </Paper.DimmedSection>
  );
}

function SaveChanges({ form }: { form: FormState }) {
  return (
    <PrimaryButton loading={form.saveChangesSubmitting} testId="save-changes" onClick={form.saveChanges}>
      Save Changes
    </PrimaryButton>
  );
}

function PublishNow({ form }: { form: FormState }) {
  const { discussion } = Pages.useLoadedData<LoaderResult>();
  if (discussion.state !== "draft") return null;

  return (
    <GhostButton loading={form.publishDraftSubmitting} testId="publish-now" onClick={form.publishDraft}>
      Publish Now
    </GhostButton>
  );
}

function CancelLink({ form }: { form: FormState }) {
  return (
    <Link to={form.cancelPath} testId="cancel-edit" className="font-medium">
      Cancel
    </Link>
  );
}

function Navigation({ space }) {
  return (
    <Paper.Navigation
      items={[
        { to: Paths.spacePath(space.id), label: space.name },
        { to: Paths.spaceDiscussionsPath(space.id), label: "Discussions" },
      ]}
    />
  );
}
