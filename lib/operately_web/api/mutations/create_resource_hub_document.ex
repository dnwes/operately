defmodule OperatelyWeb.Api.Mutations.CreateResourceHubDocument do
  use TurboConnect.Mutation
  use OperatelyWeb.Api.Helpers

  alias Operately.Operations.ResourceHubDocumentCreating
  alias Operately.ResourceHubs.{Permissions, ResourceHub}

  inputs do
    field :resource_hub_id, :id
    field :folder_id, :id
    field :name, :string
    field :content, :string
  end

  outputs do
    field :document, :document
  end

  def call(conn, inputs) do
    Action.new()
    |> run(:me, fn -> find_me(conn) end)
    |> run(:attrs, fn -> parse_inputs(inputs) end)
    |> run(:resource_hub, fn ctx -> ResourceHub.get(ctx.me, id: ctx.attrs.resource_hub_id) end)
    |> run(:permissions, fn ctx -> Permissions.check(ctx.resource_hub.request_info.access_level, :can_create_document) end)
    |> run(:operation, fn ctx -> ResourceHubDocumentCreating.run(ctx.me, ctx.resource_hub, ctx.attrs) end)
    |> run(:serialized, fn ctx -> {:ok, %{document: Serializer.serialize(ctx.operation)}} end)
    |> respond()
  end

  defp respond(result) do
    case result do
      {:ok, ctx} -> {:ok, ctx.serialized}
      {:error, :attrs, _} -> {:error, :bad_request}
      {:error, :resource_hub, _} -> {:error, :not_found}
      {:error, :permissions, _} -> {:error, :forbidden}
      {:error, :operation, _} -> {:error, :internal_server_error}
      _ -> {:error, :internal_server_error}
    end
  end

  defp parse_inputs(inputs) do
    content = Jason.decode!(inputs.content)
    {:ok, Map.put(inputs, :content, content)}
  end
end
