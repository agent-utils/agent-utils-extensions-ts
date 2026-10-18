# @agent-utils/extensions

Thin TypeScript client for the **agent_utils Extensions** server - stateless capabilities for AI agents over MCP: exact math, unit conversion and currency conversion.

This is a client for a hosted commercial service ([agent-utils.ai](https://agent-utils.ai)), not the service itself. Zero dependencies (uses the global `fetch`). Package `@agent-utils/extensions`; ESM, Node 18+.

## Install

```bash
npm install @agent-utils/extensions
```

## Quickstart

```ts
import { AgentUtilsExtensions } from "@agent-utils/extensions";

// Any secret works as a token; the first call auto-provisions a free trial.
const ext = new AgentUtilsExtensions({ token: process.env.AGENT_UTILS_TOKEN! });

await ext.evalExpr({ expr: "2^10 + 1/3" });
await ext.convert("electric_potential", "volt", "millivolt", 1.5);
await ext.convertCurrency("USD", "EUR", 100);
```

## API

**Math** - exact expression evaluation
- `eval_expr(expr)`

**Units** - 56 dimension-checked converters
- `convert(quantity, from_unit, to_unit, amount)` - calls `convert_<quantity>`. Quantities: acceleration, amount_of_substance, angle, angular_velocity, area, capacitance, catalytic_activity, diffusion_coefficient, dynamic_viscosity, electric_charge, electric_current, electric_potential, electrical_conductance, electrical_resistance, electrical_resistivity, energy, force, frequency, heat_capacity, heat_flux_density, illuminance, inductance, information, information_rate, kinematic_viscosity, length, luminance, luminous_intensity, magnetic_flux, magnetic_flux_density, mass, mass_concentration, mass_density, mass_rate, molality, molar_concentration, molar_mass, molar_volume, moment_of_inertia, momentum, power, pressure, radioactivity, specific_heat_capacity, surface_tension, temperature, temperature_interval, thermal_conductance, thermal_conductivity, thermal_resistance, time, torque, velocity, volume, volume_rate, volumetric_heat_capacity

**Currency** - ECB reference rates
- `convert_currency(from, to, amount)`
- `list_currencies()`

**Account** (on both servers) - `get_account`, `list_api_keys`, `create_api_key`, `revoke_api_key`, `list_payments`, `settle_balance`, `submit_feature_request`, `submit_exit_feedback`

- `call(name, args)` - call any tool by name

Valid unit strings for each quantity are listed in that tool's input schema (`tools/list`, no auth).

Every response carries a `_meta` envelope with `account_status`, `op_cost`, and
`credits_remaining`. The canonical, always-current reference is the server's
[llms.txt](https://mcp.agent-utils.ai/llms.txt) (per service: `/docs/<service>`).

Endpoint: `https://mcp.agent-utils.ai/extensions` (staging: `STAGING_ENDPOINT`, `https://mcp-staging.agent-utils.ai/extensions`).

## One token, both servers

agent_utils is two MCP servers on one account: **extensions** (this one) and **swarm** (memory, locks, task board, pub/sub, idempotency, webhook inbox). The same token works on both and draws from one credit pool. See the [agent-utils hub](https://github.com/agent-utils/agent-utils) for the full platform, and the Python client [`agent-utils-extensions`](https://github.com/agent-utils/agent-utils-extensions-py).

## Pricing

1 credit = $0.00001. Trial: 1,000 credits, no card. Activation: $5 -> 500,000-credit limit. Terms: [mcp.agent-utils.ai/legal.txt](https://mcp.agent-utils.ai/legal.txt).

## License

MIT. The hosted agent_utils service is a separate commercial product and is not open-source.
