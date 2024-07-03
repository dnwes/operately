defmodule OperatelyWeb.Api.Queries.GetPersonTest do
  use OperatelyWeb.TurboCase

  import Operately.CompaniesFixtures
  import Operately.PeopleFixtures

  describe "security" do
    test "it requires authentication", ctx do
      assert {401, _} = query(ctx.conn, :get_person, %{})
    end

    test "it doesn't return people from other companies", ctx do
      ctx = register_and_log_in_account(ctx)

      company2 = company_fixture(name: "Company 2")
      person_from_other_company = person_fixture(%{company_id: company2.id})

      assert {404, "Not found"} = query(ctx.conn, :get_person, %{id: person_from_other_company.id})
    end
  end

  describe "get_person functionality" do
    setup :register_and_log_in_account

    test "returns the person", ctx do
      person = person_fixture(company_id: ctx.company.id)
      assert {200, res} = query(ctx.conn, :get_person, %{id: person.id})
      assert res.person == Serializer.serialize(person, level: :full)
    end

    test "include_manager", ctx do
      manager = person_fixture(company_id: ctx.company.id)
      person = person_fixture(company_id: ctx.company.id, manager_id: manager.id)
      person = Operately.Repo.preload(person, [:manager])

      assert {200, res} = query(ctx.conn, :get_person, %{id: person.id, include_manager: true})
      assert res.person.manager == Serializer.serialize(manager, level: :essential)

      assert {200, res} = query(ctx.conn, :get_person, %{id: manager.id, include_manager: true})
      assert res.person.manager == nil
    end

    test "includes_reports", ctx do
      person = person_fixture(company_id: ctx.company.id)
      report1 = person_fixture(company_id: ctx.company.id, manager_id: person.id)
      report2 = person_fixture(company_id: ctx.company.id, manager_id: person.id)

      assert {200, res} = query(ctx.conn, :get_person, %{id: person.id, include_reports: true})
      assert length(res.person.reports) == 2
      assert Enum.find(res.person.reports, fn r -> r.id == report1.id end) == Serializer.serialize(report1, level: :essential)
      assert Enum.find(res.person.reports, fn r -> r.id == report2.id end) == Serializer.serialize(report2, level: :essential)
    end

    test "includes_peers", ctx do
      manager = person_fixture(company_id: ctx.company.id)
      person = person_fixture(company_id: ctx.company.id, manager_id: manager.id)
      peer1 = person_fixture(company_id: ctx.company.id, manager_id: manager.id)
      peer2 = person_fixture(company_id: ctx.company.id, manager_id: manager.id)

      assert {200, res} = query(ctx.conn, :get_person, %{id: person.id, include_peers: true})
      assert length(res.person.peers) == 2
      assert Enum.find(res.person.peers, fn p -> p.id == peer1.id end) == Serializer.serialize(peer1, level: :essential)
      assert Enum.find(res.person.peers, fn p -> p.id == peer2.id end) == Serializer.serialize(peer2, level: :essential)
    end
  end
end 
