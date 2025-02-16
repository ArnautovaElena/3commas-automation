import apiClient from '../utils/apiClient';

describe('Take Profit Execution', () => {
    let dealId: string;
    let accountId: string = 'your_account_id'; // Enter account ID
    
    //Fetching corresponding deal id
    beforeAll(async () => {
        const response = await apiClient.get('/v1/deals', { params: { scope: 'active', limit: 1 } });
        const deal = response.data.find((d: { pair: string; base_order_price: number; }) => d.pair === 'BTC/USDT' && d.base_order_price === 50000);
        if (!deal) throw new Error('No active BTC/USDT deal with entry price 50,000 USDT found.');
        dealId = deal.id;
    });

    test('should execute take profit when price increases and update balance', async () => {
        // Step 1: Fetching balance before closing
        const preCloseBalance = await apiClient.get(`/v1/accounts/${accountId}/balance`);
        const usdtBefore = preCloseBalance.data.usdt_balance;

        // Simulate price increase
        await apiClient.post(`/v1/deals/${dealId}/update_max_price`, { price: 52500 });

        // Step 3: Confirm that the deal is closed and exit reason is “take_profit”
        const response = await apiClient.get(`/v1/deals/${dealId}`);
        expect(response.data.status).toBe('closed');
        expect(response.data.exit_reason).toBe('take_profit');

        // Step 4: Validate user balance update
        const postCloseBalance = await apiClient.get(`/v1/accounts/${accountId}/balance`);
        const usdtAfter = postCloseBalance.data.usdt_balance;

        // Balance should increase
        expect(usdtAfter).toBeGreaterThan(usdtBefore);

        // Validate profit calculation
        const expectedProfit = 50000 * 0.05;
        const actualProfit = usdtAfter - usdtBefore;

        console.log(`Profit expected: ${expectedProfit}, Profit actual: ${actualProfit}`);
        expect(actualProfit).toBeCloseTo(expectedProfit, 0.1); // Precision with deviation of 10%

        console.log(`Balance before TP: ${usdtBefore}, Balance after TP: ${usdtAfter}`);
    });
});