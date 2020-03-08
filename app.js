

var budgetController = (function() {

  var Expense = function(id , description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };


  var Income = function(id , description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
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
    testion: function() {
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
    expensesContainer:'.expenses__list'
  };

  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value, // sera un incremento o decremento
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },


    addListItem: function(obj, type) {
      var html, newHtml, eleemnt;
      // Creamos el string de html con el placeholder text

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
      } else if(type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      

      //reemplazamos el placeholder text con los datos actuales

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);



      //Insertat el html en el dom

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
  }

 

  var ctrlAddItem = function() {
    var input, newItem;
    // 1 obtener datos del input data
    input = UIController.getInput();
    console.log(input)
    // agregar dato al budget controller
    newItem = budgetCtrl.addItem(input.type, input.description,input.value);
    // 3 agregar los datos a la ui
    UICtrl.addListItem(newItem, input.type);

    //limpir campos
      UICtrl.clearFields();

    // 4 calcular el presupuesto

    // 5 mostrar el presupuero en la ui

    console.log('Si funciona')
  };

  return {
    init: function() {
      console.log('la aplicacion inicio');
      setupEventListerners();
    }
  };
})(budgetController, UIController);


controller.init();