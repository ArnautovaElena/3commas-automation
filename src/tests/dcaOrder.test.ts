import apiClient from '../utils/apiClient';

describe('Validation of DCA Order Execution', () => {
    let dealId: string;
    let accountId: string = 'your_account_id_here'; // Enter account id
    
    //Fetching corresponding deal id
    beforeAll(async () => {
        const response = await apiClient.get('/v1/deals', { params: { scope: 'active', limit: 1 } });
        const deal = response.data.find((d: { pair: string; base_order_price: number; }) => d.pair === 'BTC/USDT' && d.base_order_price === 50000);
        if (!deal) throw new Error('No active BTC/USDT deal with entry price 50,000 USDT found.');
        dealId = deal.id;
    });

    test('should place safety orders at correct price intervals with correct sizes', async () => {
        // Define expected price levels for Safety Orders
        const priceLevels = [49000, 48000, 47000]; // -2%, -4%, -6%
        const initialSafetyOrderSize = 100; // Base Safety Order size
        let expectedOrderSize = initialSafetyOrderSize;
        
        for (const price of priceLevels) {
            // Step 1: Simulate a price drop to trigger a Safety Order
            await apiClient.post(`/v1/deals/${dealId}/update_max_price`, { price });
            
            // Step 2: Fetch updated deal details
            const response = await apiClient.get(`/v1/deals/${dealId}`);
            const safetyOrders = response.data.safety_orders;
            
            // Step 3: Verify that a new Safety Order was placed at the correct price level
            const order = safetyOrders.find((order: { price: number; }) => order.price === price);
            expect(order).toBeDefined();
            
            // Step 4: Validate the correct order size considering Safety Order Volume Scale (1.7)
            expect(order.volume).toBeCloseTo(expectedOrderSize, 1);
            expectedOrderSize *= 1.7; // Next order should increase by 70%
        }
    });
});
