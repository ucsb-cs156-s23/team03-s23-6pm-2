Bring over backend crud files for Book from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called Book.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `BookRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `BookRepository.java`; the team02 instrutions erronously called it `Book.java`; if you called it `Book.java` please update the name now)
- [ ] The `@Repository` class called `BookRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `BookRepository.java`; the team02 instrutions erronously called it `Book.java`; if you called it `Book.java` please update the name now)
- [ ] The controller file `BookController.java` is copied from team02 to team03
- [ ] The controller tests file `BookControllerTests.java` is copied from team02 to team03

- [ ] You can see the `books` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `books` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.