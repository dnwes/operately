defmodule OperatelyWeb.AccountSessionController do
  use OperatelyWeb, :controller

  alias Operately.People
  alias OperatelyWeb.AccountAuth

  def new(conn, _params) do
    render(conn, :new, error_message: nil)
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> AccountAuth.log_out_account()
  end
end
