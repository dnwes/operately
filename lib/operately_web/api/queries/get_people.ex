defmodule OperatelyWeb.Api.Queries.GetPeople do
  use TurboConnect.Query
  use OperatelyWeb.Api.Helpers

  inputs do
    field :include_suspended, :boolean
  end

  outputs do
    field :people, list_of(:person)
  end

  def call(conn, inputs) do
    company_id = me(conn).company_id
    people = load_people(company_id, inputs[:include_suspended]) 

    {:ok, %{people: Serializer.serialize(people, level: :essential)}}
  end

  defp load_people(company_id, include_suspended) do
    query = from p in Operately.People.Person, where: p.company_id == ^company_id
    query = if include_suspended, do: query, else: from p in query, where: not p.suspended
    query = from p in query, order_by: [asc: p.full_name]

    Repo.all(query)
  end
end
