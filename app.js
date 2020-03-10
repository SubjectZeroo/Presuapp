

var budgetController = (function() {

  var Expense = function(id , description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage= -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
      if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }

  }; 

  Expense.prototype.getPercentege = function() {
    return this.percentage;
  }

  var Income = function(id , description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum = sum + current.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp:[],
      inc:[]
    },
    totals: {
      exp:0,
      inc:0
    },

    budget: 0,
    percentage:0,

    allExpenses: [],
    allIncomes: [],
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // creamos un nuevo ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      


      //creamos un nuevos item basado en los tipos inc o exp
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type == 'inc') {
        newItem = new Income(ID, des, val);
      }

      // push dentro de la estrutura de datos
      data.allItems[type].push(newItem);

      //retornamos un nuevo elemento
      return newItem;  
    },

    deleteItem: function(type,  id) {
      var ids, index;
      
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {
      // calcular el total de ingresos y egreso
      calculateTotal('exp');
      calculateTotal('inc');
      // calcular el presupuesto de ingreso - egreso
      data.budget = data.totals.inc - data.totals.exp;

      
      // finalmente calcular el porcentaje del egreso que gastamos
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) ;
      } else {
        data.percentage = -1
      }
      
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercenteges: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentege();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };

})(); 




var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer:'.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };
  
  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2310 output 2,310
    }

    dec = numSplit[1]
    

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value, // sera un incremento o decremento
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },


    addListItem: function(obj, type) {
      var html, newHtml, eleemnt;
      // Creamos el string de html con el placeholder text

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
      } else if(type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      

      //reemplazamos el placeholder text con los datos actuales

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));



      //Insertat el html en el dom

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {

      
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);


    },

    clearFields: function() {
      var fields, fieldArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fieldArr = Array.prototype.slice.call(fields);

      fieldArr.forEach(function(current, index, array) {
        current.value = "";  
      });
      fieldArr[0].focus();
    },

    displayBudget: function(obj) {
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent =  formatNumber( obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      

      if(obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "-----";
      }
    },

    displayPercentages: function(percentages) {

      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      var nodelistForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodelistForEach(fields, function(current, index) {
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '----'
        }});
    },

    displayMonth: function() {

      var now, year, month
      now = new Date();

      months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      year = now.getFullYear();

      month = now.getMonth();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

    },
    getDOMstrings: function() {
      return DOMstrings;
    }
    
  };
})();




var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListerners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        console.log('SE PRESIONA LA TECLA ENTER');
        ctrlAddItem();
  
      }
  
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
  }

 var updateBudget = function() {
  // 1 Calcular el presupuesto
  budgetCtrl.calculateBudget();
  // 2 Retornar el prosupuesto
  var budget = budgetCtrl.getBudget();
  // 3 Mostrar el presupuero en la ui
  console.log(budget);
  UICtrl.displayBudget(budget);
 }

 var updatePercentages = function() {
   // 1 Calcular porcentajes
    budgetCtrl.calculatePercentages();
   //2 leer el porcentajes del controlador presupuertos
    var percentages = budgetCtrl.getPercenteges();
   //3 actualizar la ui con los nuevos porcentajes
    console.log(percentages);
    UICtrl.displayPercentages(percentages);
 }

  var ctrlAddItem = function() {
    var input, newItem;
    //1 obtener datos del input data
    input = UIController.getInput();
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      console.log(input)
      //2 Agregar dato al budget controller
      newItem = budgetCtrl.addItem(input.type, input.description,input.value);
      //3 agregar los datos a la ui
      UICtrl.addListItem(newItem, input.type);
  
      //4 limpiar campos
        UICtrl.clearFields();
  
      //5 Calcular y actualizar el prosupuerto
      updateBudget();
      console.log('Si funciona')

      //6 caulcular y actualizas porcentajes
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {

    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID ) {
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1 Eliminar el item de la estructura de datos
      budgetController.deleteItem(type, ID);
      // 2 eliminar de la ui
      UICtrl.deleteListItem(itemID)
      // 3 actualizar y mostrar el nuevo presupuestro
      updateBudget();

      // calcular y actualizar losporcentajes
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('la aplicacion inicio');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        }
      );
      setupEventListerners();
    }
  };
})(budgetController, UIController);


controller.init();