defmodule OperatelyWeb.Graphql.Queries.Activities do
  use Absinthe.Schema.Notation

  object :activity_queries do
    field :activities, list_of(:activity) do
      arg :scope_type, non_null(:string)
      arg :scope_id, non_null(:id)

      resolve fn _, args, _ ->
        activities = Operately.Activities.list_activities(args.scope_type, args.scope_id)

        {:ok, activities}
      end
    end
  end
end
