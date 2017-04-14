var KPF;

if (!KPF)
	KPF = {};


// ######################################################################
// KPF.utils
// ######################################################################

if (!KPF.utils) {
	KPF.utils = {};
	
	/** @private */
	KPF.utils._logBuildStr = function(message, context){
		var str;
		if(KPF.utils.isdefined(context))
			str = '[' + context + '] ';
		if(KPF.utils.isdefined(message))
			str = str ? str + message : message;
		return str;
	};
	/**
	 * Displays a error log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.error = function (message, context, data) {
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.error(str, data) : console.error(str);
		else if(data)
			console.error(data);
	};
	/**
	 * Displays a warning log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.warn = function (message, context, data) {
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.warn(str, data) : console.warn(str);
		else if(data)
			console.warn(data);
	};
	/**
	 * Displays a default log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.log = function (message, context, data) {
		
		if(!KPF.global.PRODUCTION)
			return;
			
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.log(str, data) : console.log(str);
		else if(data)
			console.log(data);
	};
	
	// ----  number utilities
	
	/** @param num Number */
	KPF.utils.degToRad = function (num) {
		return num / 180 * Math.PI;
	};
	/** @param num Number */
	KPF.utils.rad2Deg = function (num) {
		return num / Math.PI * 180;
	};
	/** @param num {Number} */
	KPF.utils.digits2 = function (num) {
		return num < 10 ? '0' + num : num;
	};
	/**
	 * @param min {Number}
	 * @param max {Number}
	 * @return {Number}
	 */
	KPF.utils.randomInt = function (min, max){
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	};
	/**
	 * Constrains value with the mini/maxi range.
	 * @param val     {Number}
	 * @param min     {Number}
	 * @param max     {Number}
	 * @return        {Number}
	 */
	KPF.utils.clamp = function(val, min, max){
		return Math.max(min, Math.min(max, val));
	};
	
	
	// ----  string utilities
	 
	KPF.utils.fillTo = function (o, len, pattern) {
		o = o.toString();
		while(o.length < len)
			o = pattern + o;
		return o;
	};
	KPF.utils.isfilled = function (str) {
		return typeof str === 'string' && str.length > 0;
	};
	/**
	 * Keeps number within passed-in string.
	 * @param str String
	 */
	KPF.utils.keepNumeric = function (str) {
		return str.match(/\d/g).join('');
	};
	/**
	 * Repeats passed-in pattern the according to iteration setting.
	 * @param iteration Number
	 * @param pattern String pattern to be repeated
	 */
	KPF.utils.repeat = function(iteration, pattern){
		var out = '';
		
		if(isNaN(iteration))
			iteration = 0;
		else if(!(KPF.utils.isdefined(pattern))){
			KPF.utils.warn('Illegal arguments', 'KPF.utils.repeat', {
				iteration: iteration,
				pattern: pattern
			});
			return out;
		}
		
		while(iteration > 0){
			out += pattern;
			--iteration;
		}
		return out;
	};
	
	
	// ----  typecheck utilities
	
	KPF.utils.isdefined = function (arg) {
		return arg !== void 0 && arg !== null;
	};
	KPF.utils.isstring = function (str) {
		return typeof str === 'string';
	};
	KPF.utils.isarray = function (arg) {
		if (Array.isArray)
			return Array.isArray(arg);
		return objectToString(arg) === '[object Array]';
	};
	KPF.utils.isbool = function (arg) {
		return typeof arg === 'boolean';
	};
	KPF.utils.isan = function (arg) {
		return typeof arg === 'number' && arg + 1 == arg + 1;
	};
	
	
	// ----  array utilities
	
	/**
	 * @param arr Array
	 * @returns Array
	 */
	KPF.utils.arrGetUnique = function (arr) {
		var u = {},
			a = [];
		for (var i = 0, l = arr.length; i < l; ++i) {
			if (u.hasOwnProperty(arr[i]))
				continue;
			a.push(arr[i]);
			u[arr[i]] = 1;
		}
		return a;
	};
}