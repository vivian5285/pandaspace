describe('API Endpoints', () => {
  describe('GET /earnings/summary', () => {
    it('should return earnings summary for authenticated user', async () => {
      const response = await request(app)
        .get('/earnings/summary')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('todayEarnings');
      expect(response.body).toHaveProperty('monthEarnings');
      expect(response.body).toHaveProperty('totalEarnings');
    });
  });

  // 其他接口的测试用例...
}); 