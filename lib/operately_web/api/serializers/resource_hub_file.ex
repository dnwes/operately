defimpl OperatelyWeb.Api.Serializable, for: Operately.ResourceHubs.File do
  def serialize(file, level: :essential) do
    %{
      id: OperatelyWeb.Paths.file_id(file),
      name: file.node.name,
      description: Jason.encode!(file.description),
      type: Ecto.assoc_loaded?(file.blob) && file.blob.content_type,
      size: Ecto.assoc_loaded?(file.blob) && file.blob.size,
    }
  end

  def serialize(file, level: :full) do
    %{
      id: OperatelyWeb.Paths.file_id(file),
      author: OperatelyWeb.Api.Serializer.serialize(file.author),
      resource_hub: OperatelyWeb.Api.Serializer.serialize(file.node.resource_hub),
      parent_folder: OperatelyWeb.Api.Serializer.serialize(file.node.parent_folder),
      name: file.node.name,
      description: Jason.encode!(file.description),
      reactions: OperatelyWeb.Api.Serializer.serialize(file.reactions),
      inserted_at: OperatelyWeb.Api.Serializer.serialize(file.inserted_at),
      permissions: OperatelyWeb.Api.Serializer.serialize(file.permissions),
      blob: OperatelyWeb.Api.Serializer.serialize(file.blob),
    }
  end
end
