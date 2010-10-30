var AJSUnit = function(testSuite){
	//Private methods
	var stack = new Array();
	var currentMethodName =  '';
	var executeAfterOnLoad = function(){
		for(var methodName in testSuite.tests){
			currentMethodName = methodName;
			try{
				testSuite.tests[methodName](publicMethods);
			}catch(e){
				//errors++;
				pushOnToStack(null);
			}
		}
		show();					
	};
	var showCreateTableHead = function(table){
		//Table head
		var thead = document.createElement('thead');
		table.appendChild(thead);
		var tr = document.createElement('tr');
		thead.appendChild(tr);
		//Head columns
		var th = document.createElement('th');
		tr.appendChild(th);
		th.innerHTML = 'Method name';
		var th = document.createElement('th');
		tr.appendChild(th);
		th.innerHTML = 'Assertions';
		var th = document.createElement('th');
		tr.appendChild(th);
		th.innerHTML = 'Failures';
		var th = document.createElement('th');
		tr.appendChild(th);
		th.innerHTML = 'Errors';	
	};
	var showCreateTableFoot = function(table, assertions, errors, failures){
		var tfoot = document.createElement('tfoot');
		table.appendChild(tfoot);
		var tr = document.createElement('tr');
		tfoot.appendChild(tr);
		//Foot columns
		var td = document.createElement('td');
		td.align = 'right';
		td.colSpan = 2;
		tr.appendChild(td);
		td.innerHTML = assertions;					
		var td = document.createElement('td');
		td.align = 'right';
		tr.appendChild(td);
		td.innerHTML = failures;					
		var td = document.createElement('td');
		td.align = 'right';
		tr.appendChild(td);
		td.innerHTML = errors;					
	};
	var show = function(){
		var h1 = document.createElement('h1');
		document.body.appendChild(h1);
		h1.innerHTML = 'Yes, you are running an Another JavaScript Unit Test library';

		var table = document.createElement('table');
		table.border = '1px';
		table.width = '100%';
		document.body.appendChild(table);
		//Create the head
		showCreateTableHead(table);
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		var assertions = 0;
		var errors = 0;
		var failures = 0;
		for(var i = 0; i < stack.length; i++){
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
			var td = document.createElement('td');
			tr.appendChild(td);
			td.innerHTML = stack[i].methodName;
			var td = document.createElement('td');
			td.align = 'right';
			tr.appendChild(td);
			td.innerHTML = stack[i].assertions;
			var td = document.createElement('td');
			td.align = 'right';
			tr.appendChild(td);
			td.innerHTML = stack[i].failures;
			var td = document.createElement('td');
			td.align = 'right';
			tr.appendChild(td);
			td.innerHTML = stack[i].errors;
			tr.style.background = (stack[i].failures > 0 || stack[i].errors > 0)? '#FFCCCC' : '#CCFFCC';
			failures += stack[i].failures;
			errors += stack[i].errors;
			assertions += stack[i].assertions;
		}
		//Table foot
		showCreateTableFoot(table, assertions, errors, failures);
	};
	var pushOnToStack = function(cond){
		var stackItem = getStackItem();
		stackItem.assertions++;
		if(!cond){
			stackItem.failures++;
		}
		if(cond == null){
			stackItem.errors++;
		}
	};
	var getStackItem = function(){
		for(var i = 0; i < stack.length; i++){
			if(stack[i].methodName == currentMethodName){
				return stack[i];
			}
		}
		var result = {
			methodName: currentMethodName,
			assertions: 0,
			failures: 0,
			errors: 0
		}
		stack.push(result);
		return result;
	};
	//Public methods
	var publicMethods = {
		ok: function(cond){
			pushOnToStack(cond);
		},		
		eq: function(expected, actual){
			pushOnToStack(expected == actual);
		},
		ne: function(expected, actual){
			pushOnToStack(expected != actual);
		},
		execute: function(){
			window.onload = function(){
				executeAfterOnLoad();
			};
		}
	};
	return publicMethods;
};