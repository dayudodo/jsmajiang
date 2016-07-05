// var  tt = require('./tt')
describe('Base Valid', function() {
	it('should validAA', function() {
		expect(validAA('b1 b1')).toBe(true)
	});
	it('should validAAA', function() {
		expect(validAAA('b1 b1 b1')).toBe(true)
		expect(validAAA_reg('b1 b1 b1')).toBe(true)
	});
	it('should validAAA false', function() {
		expect(validAAA('b1 b1   b2')).toBe(false)
	});

	describe('valid4A group', function() {
		it(`0 should valid4A 'b1 b1 b1 b1' true`, function() {
			let str = 'b1 b1 b1 b1'
			expect(valid4A(str)).toBe(true)
		});
		it("0.0 should valid4A 'b1 b1 b1 b1' true", function() {
			let str = 'b1 b1 b1 b1'
			expect(valid4A_reg(str)).toBe(true)
		});
		it(`1 should valid4A  false`, function() {
			let str = 'b1 b2 b1 b1'
			expect(valid4A(str)).toBe(false)
		});
		it(`2 should valid4A  false`, function() {
			let str = 'b1 b1 b2 b1'
			expect(valid4A(str)).toBe(false)
		});
		it(`3 should valid4A  false`, function() {
			let str = 'b1 b1 b1 b2'
			expect(valid4A(str)).toBe(false)
		});
		it('4 should vlaid4A throw error', function() {
			let str='b1'
			expect(valid4A.bind(null,str)).toThrowError(/must have/)
		});
	});

	describe('ABC group', function() {
		it('should validABC true', function() {
			expect(validABC('b1 b2 b3')).toBe(true)
		});
		it('should validABC true', function() {
			expect(validABC('f7 f8 f9')).toBe(true)
		});
		it('should validABC false', function() {
			expect(validABC('b1 b2 b4')).toBe(false)
		});
		it('should validABC throw null error', function() {
			expect(validABC).toThrowError('str is null or undefined')
			// expect(foo(1)).toThrowError(/foo/)
		});
		it('should validABC throw values error', function() {
			let str='b1 b2 b4 b5'
			expect(validABC.bind(null,str)).toThrowError(/must have/)
		});
	});

	describe('2ABC group', function() {
		it('1 should valid2ABC true', function() {
			let str='b1 b2 b3 b4 b5 b6'
			expect(valid2ABC(str)).toBe(true)
		});
		it('1.1 should valid2ABC true', function() {
			let str='b1 b2 b3 b5 b4 b6'
			expect(valid2ABC(str)).toBe(true)
		});
		it('1.2 should valid2ABC true', function() {
			let str='b1 b2 b3 t5 t4 t6'
			expect(valid2ABC(str)).toBe(true)
		});
		it('2 should valid2ABC true', function() {
			let str='b1 b2 b2 b3 b3 b4'
			expect(valid2ABC(str)).toBe(true)
		});
		it('3 should valid2ABC true', function() {
			let str='b1 b1 b1 t3 t4 t5'
			expect(valid2ABC(str)).toBe(true)
		});
		it('4 should valid2ABC 非框', function() {
			let str='b1 b2 b3 b3 b3 b3'
			expect(valid2ABC(str)).toBe(true)
		});
		it('5 should valid2ABC true', function() {
			let str='b1 b2 b3 zh zh zh'
			expect(valid2ABC(str)).toBe(true)
		});
		it('5.1 should valid2ABC true', function() {
			let str='b1 b1 b2 b2 b3 b3'
			expect(valid2ABC(str)).toBe(true)
		});
		it('6 should valid2ABC false', function() {
			let str='b1 b2 t2 b3 b3 b5'
			expect(valid2ABC(str)).toBe(false)
		});
		it('7 should valid2ABC true', function() {
			let str='fa fa fa b1 t1 zh'
			expect(valid2ABC(str)).toBe(false)
		});
		it('7 should valid2ABC true', function() {
			let str='fa fa fa b1 t1 zh'
			expect(valid2ABC(str)).toBe(false)
		});
	});

	describe('valid3ABC group', function() {
		it('valid3ABC 正规九张牌', function() {
			let str='b1 b2 b3 fa fa fa t1 t2 t3'
			expect(valid3ABC(str)).toBe(true)
		});
		it('valid3ABC 九张 122334123', function() {
			let str='b1 b2 b2 b3 b3 b4 t1 t2 t3'
			expect(valid3ABC(str)).toBe(true)
		});
		it('valid3ABC 九张 112233456', function() {
			let str='b1 b1 b2 b2 b3 b3 b4 b5 b6'
			expect(valid3ABC(str)).toBe(true)
		});	
		it('valid3ABC 九张 123445566', function() {
			let str='b1 b2 b3 b4 b4 b5 b5 b6 b6'
			expect(valid3ABC(str)).toBe(true)
		});
	});

	describe('valid4ABC group', function() {
		it('valid4ABC 12张牌', function() {
			let str='b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6'
			expect(valid4ABC(str)).toBe(true)
			let str1= 'b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4'
			expect(valid4ABC(str1)).toBe(true)
		});
		it('valid4ABC 12张牌 前6错位', function() {
			let str='b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4'
			expect(valid4ABC(str)).toBe(true)
		});
		it('valid4ABC 12张牌，中间错位', function() {
			let str='zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3'
			expect(valid4ABC(str)).toBe(true)
		});
		it('valid4ABC 12张牌 前9 112233', function() {
			let str='b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9'
			expect(valid4ABC(str)).toBe(true)
		});
		it('valid4ABC 12张牌 后9 112233', function() {
			let str='b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7'
			expect(valid4ABC(str)).toBe(true)
		});
		it('valid4ABC 12 false', function() {
			let str='b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh'
			expect(valid4ABC(str)).toBe(false)
		});
		it('valid4ABC 12张牌', function() {
			let str='b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6'
			expect(valid4ABC(str)).toBe(true)
		});

	});


});
