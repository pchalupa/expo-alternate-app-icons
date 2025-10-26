# Contributing

## Development Workflow

1. Clone the repository and install dependencies:
   ```bash
   yarn install
   ```

2. Make your changes:
   - **Native modules**: Edit iOS Swift code in `ios/` or Android Kotlin code in `android/`
   - **Config plugin**: Edit TypeScript code in `plugin/src/`
   - **Core library**: Edit TypeScript code in `src/`

3. Build the project:
   ```bash
   yarn build
   ```

4. Test your changes in the example app:
   ```bash
   cd example
   yarn expo prebuild --clean
   yarn expo run:ios  # or yarn expo run:android
   ```

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `chore:` for maintenance tasks

Example: `feat: add support for tinted icons on iOS`

## Pull Requests

1. Ensure your code passes linting: `yarn lint`
2. Create a pull request with a clear description
3. Reference any related issues
4. Automated tests will run on your PR