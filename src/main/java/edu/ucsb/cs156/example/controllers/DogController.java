package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Dog;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.DogRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Api(description = "Dogs")
@RequestMapping("/api/dogs")
@RestController
public class DogController extends ApiController {

    @Autowired
    DogRepository dogRepository;

    @ApiOperation(value = "List all dogs")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Dog> allDogs() {
        Iterable<Dog> dogs = dogRepository.findAll();
        return dogs;
    }

    @ApiOperation(value = "Get a single dog")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Dog getById(
            @ApiParam("name") @RequestParam String name) {
        Dog dog = dogRepository.findById(name)
                .orElseThrow(() -> new EntityNotFoundException(Dog.class, name));

        return dog;
    }

    @ApiOperation(value = "Create a new dog")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Dog postDog(
            @ApiParam("name") @RequestParam String name,
            @ApiParam("breed") @RequestParam String breed,
            @ApiParam("gender (`Male` or `Female`)") @RequestParam String gender)
            throws JsonProcessingException {

        Dog dog = new Dog();
        dog.setName(name);
        dog.setBreed(breed);
        dog.setGender(gender);

        Dog savedDog = dogRepository.save(dog);

        return savedDog;
    }

    @ApiOperation(value = "Delete a Dog")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteDog(
            @ApiParam("name") @RequestParam String name) {
        Dog dog = dogRepository.findById(name)
                .orElseThrow(() -> new EntityNotFoundException(Dog.class, name));

        dogRepository.delete(dog);
        return genericMessage("Dog with id %s deleted".formatted(name));
    }

    @ApiOperation(value = "Update a single dog")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Dog updateDog(
            @ApiParam("name") @RequestParam String name,
            @RequestBody @Valid Dog incoming) {

        Dog dog = dogRepository.findById(name)
                .orElseThrow(() -> new EntityNotFoundException(Dog.class, name));

dog.updateFrom(incoming);

        dogRepository.save(dog);

        return dog;
    }
}
