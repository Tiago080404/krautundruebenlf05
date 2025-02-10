# THE MOST USEFUL SQL STATEMENTS

This guide provides a comprehensive overview of essential SQL statements, their explanations, and examples for better understanding and practical use.

---

## **1. SELECT**

**Explanation:**  
The `SELECT` command is often considered the most important SQL command. Most queries begin with this command, as it is used to retrieve data from a database.

**Example:**

```sql
SELECT column1, column2, ... FROM table_name;
```

---

## **2. WHERE**

**Explanation:**  
The `WHERE` clause filters the data returned by a `SELECT`, `UPDATE`, or `DELETE` statement based on specific conditions.

**Example:**

```sql
SELECT column1, column2, ... FROM table_name WHERE condition;
```

---

## **3. INSERT**

**Explanation:**  
The `INSERT` command allows you to add new data into a table.

**Example:**

```sql
INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);
```

---

## **4. UPDATE**

**Explanation:**  
The `UPDATE` command is used to modify existing data in a table.

**Example:**

```sql
UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE condition;
```

---

## **5. DELETE**

**Explanation:**  
The `DELETE` command removes data from a table.

**Example:**

```sql
DELETE FROM table_name WHERE condition;
```

---

## **6. ORDER BY**

**Explanation:**  
The `ORDER BY` clause is used to sort the result set in ascending (`ASC`) or descending (`DESC`) order.

**Example:**

```sql
SELECT column1, column2, ... FROM table_name ORDER BY column_name ASC|DESC;
```

---

## **7. GROUP BY**

**Explanation:**  
The `GROUP BY` clause groups rows that share the same values in a specific column. It is often used with aggregate functions like `SUM`, `COUNT`, or `AVG`.

**Example:**

```sql
SELECT column1, column2, ... FROM table_name GROUP BY column_name;
```

---

## **8. JOIN**

**Explanation:**  
The `JOIN` clause combines rows from two or more tables based on related columns. Common types include `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN`.

**Example:**

```sql
SELECT column1, column2, ... FROM table1
INNER JOIN table2 ON table1.column_name = table2.column_name;
```

---

## **9. ALTER**

**Explanation:**  
The `ALTER` statement changes the structure of an existing database object, such as adding, modifying, or dropping columns in a table.

**Example:**

```sql
ALTER TABLE table_name
ADD column_name datatype;
```

_Adding a column `description` to the `products` table:_

```sql
ALTER TABLE products
ADD description VARCHAR(100);
```

---

## **10. CREATE**

**Explanation:**  
The `CREATE` statement is used to create new database objects, such as tables, views, or indexes.

**Example:**  
Creating a new table:

```sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype,
    ...
);
```
