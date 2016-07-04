// var  tt = require('./tt')
describe('base valid', function() {
	it('should behave...', function() {
		expect('abc').toEqual(tt(1));
		expect('this').toBe('this');
		expect('ABCD').toEqual('DCBA'.split("").reverse().join(''))
	});
	it('should validAA', function() {
		expect(validAA('b1 b1')).toBe(true)
	});
	it('should validAAA', function() {
		expect(validAAA('b1 b1 b1')).toBe(true)
	});
	it('should validAAA false', function() {
		expect(validAAA('b1 b1   b2')).toBe(false)
	});

	describe('valid4A group', function() {
		it('should valid4A true', function() {
			expect(valid4A('b1 b1 b1 b1')).toBe(true)
		});
		it('should valid4A false', function() {
			expect(valid4A('b1 b2 b1 b1')).toBe(false)
		});
			it('should valid4A false', function() {
			expect(valid4A('b1 b1 b2 b1')).toBe(false)
		});
		it('should valid4A false', function() {
			expect(valid4A('b1 b1 b1 b2')).toBe(false)
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
		it('should validABC error', function() {
			expect(validABC('b1 b2 b4 b5')).toBe(false)
		});


	});


});