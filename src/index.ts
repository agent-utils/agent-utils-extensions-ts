// SPDX-License-Identifier: MIT
// Thin MCP-over-HTTP client for the hosted agent_utils Extensions server: exact math,
// unit conversion (general, electrical, chemistry, thermodynamics) and currency.
// This is a client, not the service - see https://agent-utils.ai.
// Zero dependencies: uses the global `fetch` (Node 18+).

export interface AgentUtilsOptions {
  /** Bearer token. Any secret works - the first call auto-provisions a free trial. */
  token: string;
  /** Override the MCP endpoint (defaults to production; see `STAGING_ENDPOINT`). */
  endpoint?: string;
}

export const DEFAULT_ENDPOINT = "https://mcp.agent-utils.ai/extensions";
export const STAGING_ENDPOINT = "https://mcp-staging.agent-utils.ai/extensions";

/** Client for the agent_utils Extensions MCP server. The same token works on both
 *  agent_utils servers (swarm and extensions) - see https://agent-utils.ai. */
export class AgentUtilsExtensions {
  private readonly token: string;
  private readonly endpoint: string;
  private id = 0;

  constructor(opts: AgentUtilsOptions) {
    this.token = opts.token;
    this.endpoint = opts.endpoint ?? DEFAULT_ENDPOINT;
  }

  /** Call any MCP tool by name and return its result. */
  async call<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++this.id, method: "tools/call", params: { name, arguments: args } }),
    });
    if (!res.ok) throw new Error(`agent_utils HTTP ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { result?: T; error?: { message?: string } };
    if (body.error) throw new Error(`agent_utils: ${body.error.message ?? "unknown error"}`);
    return body.result as T;
  }

  evalExpr(args: Record<string, unknown> = {}) {
    return this.call("eval_expr", args);
  }

  /** Convert `amount` between units of `quantity` (e.g. "length", "electric_potential").
   *  See the README for the full quantity list. */
  convert(quantity: string, fromUnit: string, toUnit: string, amount: number) {
    return this.call("convert_" + quantity, { from: fromUnit, to: toUnit, amount });
  }

  /** Convert `amount` between ISO 4217 currencies at the latest ECB reference rate. */
  convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
    return this.call("convert_currency", { from: fromCurrency, to: toCurrency, amount });
  }

  listCurrencies() {
    return this.call("list_currencies", {});
  }

  // --- account (also on swarm) ---------------------------------------------

  getAccount() {
    return this.call("get_account", {});
  }

  listApiKeys(args: Record<string, unknown> = {}) {
    return this.call("list_api_keys", args);
  }

  createApiKey(args: Record<string, unknown> = {}) {
    return this.call("create_api_key", args);
  }

  revokeApiKey(args: Record<string, unknown> = {}) {
    return this.call("revoke_api_key", args);
  }

  listPayments(args: Record<string, unknown> = {}) {
    return this.call("list_payments", args);
  }

  settleBalance(args: Record<string, unknown> = {}) {
    return this.call("settle_balance", args);
  }

  submitFeatureRequest(args: Record<string, unknown> = {}) {
    return this.call("submit_feature_request", args);
  }

  submitExitFeedback(args: Record<string, unknown> = {}) {
    return this.call("submit_exit_feedback", args);
  }
}
