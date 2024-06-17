defmodule Operately.Activities.Content.GoalCheckInAcknowledgement do
  use Operately.Activities.Content

  embedded_schema do
    belongs_to :company, Operately.Companies.Company
    belongs_to :goal, Operately.Goals.Goal
    belongs_to :update, Operately.Updates.Update
  end

  def changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, __schema__(:fields))
    |> validate_required(__schema__(:fields))
  end

  def build(params) do
    changeset(params)
  end
end
