Bring over backend crud files for Dog from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called Dog.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `DogRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `DogRepository.java`; the team02 instrutions erronously called it `Dog.java`; if you called it `Dog.java` please update the name now)
- [ ] The `@Repository` class called `DogRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `DogRepository.java`; the team02 instrutions erronously called it `Dog.java`; if you called it `Dog.java` please update the name now)
- [ ] The controller file `DogController.java` is copied from team02 to team03
- [ ] The controller tests file `DogControllerTests.java` is copied from team02 to team03

- [ ] You can see the `dogs` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `dogs` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Dog` all work properly in Swagger.
