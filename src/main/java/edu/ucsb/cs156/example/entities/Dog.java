package edu.ucsb.cs156.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "dog")
public class Dog {

  public void updateFrom(Dog other) {
    this.name = other.name;
    this.breed = other.breed;
  }

  @Id
  private String name;
  private String breed;
}
