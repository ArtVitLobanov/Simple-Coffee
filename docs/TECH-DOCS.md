# Simple Coffee — Технічна документація

Simple Coffee — це веб-додаток для електронної комерції з повним стеком, створений з використанням **TypeScript**, **Angular**, **Express.js** та **MongoDB**.

---

## 1. Огляд технологічного стеку

* **Фронтенд:** Angular (автономні компоненти, сигнали, HttpClient)
* **Бекенд:** Node.js, Express.js, TypeScript
* **База даних:** MongoDB з ORM Mongoose
* **Потік даних та архітектура:** рівень мапування DTO для безпечного перетворення даних між документами MongoDB та моделями фронтенду.

---

## 2. Архітектура проєкту (діаграми)

### Back-end:
<img src="./assets/back-end class diagram.png" alt="Back-end architecture" width="720" />

### Front-end:
<img src="./assets/front-end class diagram.png" alt="Back-end architecture" width="720" />

---

## 3. Back-end API

Нижче наведено список всіх API які підтримує back-end:

### POST
* **api/post-auth-client** | {name, password} - здійснює авторизацію користувача
* **api/post-create-product** | {name, description, price, image} - здійснює створення товару
* **api/post-update-product** | {productID, newName, newDescription, newPrice, newImage} - здійснює оновлення певного (за ID) товару
* **api/post-delete-product** | {productID} - здійснює видалення певного (за ID) товару
* **api/post-make-transaction** | {products} - здійснює транзакцію
### GET
* **api/get-is-admin** | {status: 200/400} - повертає 200 якщо користувач адміністратор, інакше 400
* **api/get-products** | {products} - повертає список всіх товарів в базі даних
* **api/get-user-profile** | {userprofile} - повертає профіль користувача
