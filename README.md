# ezmonitor

ezmonitor is a comprehensive monitoring tool that allows users to track various metrics for their applications, including request counts, response times, unique visitors, CPU usage, and memory usage.

## Features

- User account creation and management
- Project creation with unique API keys
- Metric tracking (requests per second, minute, day, week, month, and year)
- Endpoint-specific reporting
- Unique visitor counting
- CPU and memory usage monitoring
- Central aggregation service for reports from various users
- NestJS library for easy integration

## Technology Stack

- Deno for Supabase functions
- Supabase for database, authentication, and function deployment
- NestJS for the integration library

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Initialize Supabase: `npx supabase init`
4. Set up your Supabase project and update the configuration in `supabase/config.toml`
5. Deploy Supabase functions: `npx supabase functions deploy`
6. Run database migrations: `npx supabase db push`

## Usage

1. Create a user account
2. Create a project and obtain an API key
3. Integrate the NestJS library into your application
4. Start sending reports using the API key
5. View metrics and reports through the ezmonitor dashboard

## Documentation

For detailed documentation on how to use ezmonitor and integrate it into your projects, please refer to the [Wiki](https://github.com/your-username/ezmonitor/wiki).

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.