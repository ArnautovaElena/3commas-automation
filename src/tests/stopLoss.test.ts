import apiClient from '../utils/apiClient';

describe('Stop Loss Execution', () => {
    let dealId: string;
    let accountId: string = 'your_account_id'; // Enter account id

    //Fetching corresponding deal id
    beforeAll(async () => {
        const response = await apiClient.get('/v1/deals', { params: { scope: 'active', limit: 1 } });
        const deal = response.data.find((d: { pair: string; base_order_price: number; }) => d.pair === 'BTC/USDT' && d.base_order_price === 50000);
        if (!deal) throw new Error('No active BTC/USDT deal with entry price 50,000 USDT found.');
        dealId = deal.id;
    });

    test('should execute stop loss when price drops and update balance', async () => {
        // Step 1: Fetching balance before closing
        const preCloseBalance = await apiClient.get(`/v1/accounts/${accountId}/balance`);
        const lockedBefore = preCloseBalance.data.locked_amount;
        const usdtBefore = preCloseBalance.data.usdt_balance;

        // Step 2: Simulate market price drop by 5%
        await apiClient.post(`/v1/deals/${dealId}/update_max_price`, { price: 47500 });

        // Step 3: Confirm that the deal is closed and exit reason is “stop_loss”
        const response = await apiClient.get(`/v1/deals/${dealId}`);
        expect(response.data.status).toBe('closed');
        expect(response.data.exit_reason).toBe('stop_loss');

        // Step 4: Validate user balance update
        const postCloseBalance = await apiClient.get(`/v1/accounts/${accountId}/balance`);
        expect(postCloseBalance.data.usdt_balance).toBeGreaterThan(usdtBefore); // Balance should increase
        expect(postCloseBalance.data.locked_amount).toBeLessThan(lockedBefore); // Locked amount should decrease

        console.log("Balance before SL:", usdtBefore, "| Balance after SL:", postCloseBalance.data.usdt_balance);
    });
});
