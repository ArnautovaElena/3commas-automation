# TypeScript + Jest API Tests

This repository contains automated API tests using the Jest framework and TypeScript.

---

## Prerequisites

Before running the tests, ensure you have the following installed:

1. **Git**: [Download and install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

2. **Node.js and npm**: [Download and install Node.js](https://nodejs.org/)

   - Recommended version: Node.js 16.x or higher.

3. **Jest for test execution**

   ```bash
   npm install --save-dev jest ts-jest @types/jest
   ```

4. **Axios for API requests**

   ```bash
   npm install axios
   ```

5. **Dotenv for environment variable management**

   ```bash
   npm install dotenv
   ```

6. **TypeScript for static typing**

   ```bash
   npm install --save-dev typescript
   ```

## Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone git@github.com:ArnautovaElena/3commas-automation.git
cd 3commas-automation
```

## Next Steps

1. **Set up environment variables**

   - Create a `.env` file in the root directory and add:
     ```env
     API_KEY=your_api_key_here
     ```

2. **Run tests**

   - Execute all tests:
     ```bash
     npm test
     ```
   - Run a specific test:
     ```bash
     npx jest src/tests/dcaOrders.test.ts
     ```

3. **View test results**

   - Jest will display test results in the console.



