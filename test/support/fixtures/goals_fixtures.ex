defmodule Operately.GoalsFixtures do
  alias Operately.Access.Binding
  alias Operately.Goals.Timeframe

  def goal_fixture(creator, attrs \\ %{}) do
    attrs = Enum.into(attrs, %{
      name: "some name",
      champion_id: attrs[:champion_id] || creator.id,
      reviewer_id: attrs[:reviewer_id] || creator.id,
      timeframe: Timeframe.current_quarter(),
      targets: [
        %{
          name: "First response time",
          from: 30,
          to: 15,
          unit: "minutes",
          index: 0
        },
        %{
          name: "Increase feedback score to 90%",
          from: 80,
          to: 90,
          unit: "percent",
          index: 1
        }
      ],
      company_access_level: Binding.comment_access(),
      space_access_level: Binding.edit_access(),
      anonymous_access_level: Binding.view_access(),
    })

    {:ok, goal} = Operately.Goals.create_goal(creator, attrs)

    Operately.Goals.get_goal!(goal.id)
  end

  def goal_update_fixture(author, goal, attrs \\ []) do
    attrs = Enum.into(attrs, %{
      goal_id: goal.id,
      status: "on_track",
      target_values: [],
      content: Operately.Support.RichText.rich_text("content"),
      send_to_everyone: false,
      subscription_parent_type: :goal_update,
      subscriber_ids: [],
      timeframe: Timeframe.current_year()
    })

    {:ok, update} = Operately.Operations.GoalCheckIn.run(author, goal, attrs)
    update
  end
end
