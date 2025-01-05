import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <!-- Option 1: showcase -->
    <div>Без форматування: {{ myDate }}</div>
    <div>3 форматуванням: {{ myDate | date }}</div>
    <br />

    <!-- Options 2: built-in pipes -->
    <div>{{ welcome | uppercase }}</div>
    <div>{{ welcome | lowercase }}</div>
    <div>{{ persentage | percent }}</div>
    <div>{{ persentage | currency }}</div>
    <br />

    <!-- Options 3: parameters -->
    <div>{{ welcome | slice : 3 }}</div>
    <div>{{ welcome | slice : 6 : 11 }}</div>
    <br />

    <!-- Options 4: formatting dates -->
    <div>{{ myNewDate | date : "dd/MM/yyyy" }}</div>
    <br />

    <!-- Options 5: formatting numbers -->
    <div>{{ pi | number : "2.1-2" }}</div>
    <div>{{ pi | number : "3.5-5" }}</div>
    <br />

    <!-- Options 6: formatting currencies -->
    <div>{{ money | currency : "UAH" : "code" }}</div>
    <div>{{ money | currency : "UAH" : "symbol-narrow" }}</div>
    <div>{{ money | currency : "UAH" : "symbol" : "1.1-1" }}</div>
    <div>{{ money | currency : "UAH" : "symbol-narrow" : "1.1-1" }}</div>
    <div>{{ money | currency : "UAH" : "Тільки сьогодні по ціні " }}</div>
    <br />

    <!-- Option 7: combining multiple pipes -->
    <div>{{ message | slice : 6 : 11 | uppercase }}</div>
    <br />

    <!-- Option 8: custom pipes -->
    <div>Число до форматування: {{ x }}</div>
    <div>Число після форматування: {{ x | format }}</div>
    <br />

    <!-- Option 9: custom pipes with parameters -->
    <div>{{ users | join }}</div>
    <div>{{ users | join : 1 }}</div>
    <div>{{ users | join : 1 : 3 }}</div>
    <br />

    <!-- Root -->
    <div>{{ 16 | root }}</div>
    <div>{{ 27 | root }}</div>
    <div>{{ -25 | root }}</div>
  `,
})
export class AppComponent {
  myDate = new Date(1961, 3, 12);

  welcome = "Hello World!";
  persentage = 0.14;

  myNewDate = Date.now();

  pi = 3.1415;

  money = 23.45;

  message = "Hello World!";

  x = 15.45;

  users = ["Tom", "Alice", "Sam", "Kate", "Bob"];
}
