**DISCLAIMER:** This repository uses a library currently in its early development stage. Features may be incomplete or subject to change. Breaking changes may occur without notice until the first stable release.

# juneojs-examples

## Introduction

This repository contains example projects demonstrating the use of the JuneoJS library for some functionalities.

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher

## Installation

1. Clone the repository:  
   `git clone https://github.com/Juneo-io/juneojs-examples.git`
2. Navigate to the project directory:  
   `cd juneojs-examples`

3. Install dependencies:  
   `npm install`

4. Create a `.env` file in the root directory and add your Mnemonic (see `.env.example` for details).

## Usage

Run the different examples using the following command:

```bash
npx ts-node src/<example-name>
```

### Examples

- `docs/addValidator.ts`: This example demonstrates how to add a validator to the Juneo network.
- `docs/crossJunetoJVM.ts`: This example shows how to send a cross-chain transaction from JUNE Chain to the JVM Chain.

More documentation will be provided in the future. Stay tuned!

## License

This project is licensed under the BSD 3-Clause License. See the [LICENSE](LICENSE) file for more details.
