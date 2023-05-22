package edu.ucsb.cs156.example.entities;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "book")
public class Book {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String title;
  private String author;
  private String year;

    public void updateFrom(Book other) {
        this.title = other.title;
        this.author = other.author;
        this.year = other.year;
    }
}