package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Dog;
import edu.ucsb.cs156.example.repositories.DogRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = DogController.class)
@Import(TestConfig.class)
public class DogControllerTests extends ControllerTestCase {

    @MockBean
    DogRepository dogRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/dogs/admin/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/dogs/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/dogs/all"))
                .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/dogs?name=max"))
                .andExpect(status().is(403)); // logged out users can't get by id
    }

    // Authorization tests for /api/dogs/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/dogs/post"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/dogs/post"))
                .andExpect(status().is(403)); // only admins can post
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange

        Dog dog = Dog.builder()
                .name("Max")
                .breed("Golden Retriever")
                .gender("Male")
                .build();

        when(dogRepository.findById(eq("Max"))).thenReturn(Optional.of(dog));

        // act
        MvcResult response = mockMvc.perform(get("/api/dogs?name=Max"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(dogRepository, times(1)).findById(eq("Max"));
        String expectedJson = mapper.writeValueAsString(dog);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

@WithMockUser(roles = { "USER" })
@Test
public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

// arrange

when(dogRepository.findById(eq("dne"))).thenReturn(Optional.empty());

// act
MvcResult response = mockMvc.perform(get("/api/dogs?name=dne"))
.andExpect(status().isNotFound()).andReturn();

// assert

verify(dogRepository, times(1)).findById(eq("dne"));
Map<String, Object> json = responseToJson(response);
assertEquals("EntityNotFoundException", json.get("type"));
assertEquals("Dog with id dne not found", json.get("message"));
}

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_dogs() throws Exception {

        // arrange

        Dog max = Dog.builder()
                .name("Max")
                .breed("Golden Retriever")
                .gender("Male")
                .build();

        Dog annie = Dog.builder()
                .name("Annie")
                .breed("Poodle")
                .gender("Female")
                .build();

        ArrayList<Dog> expectedDogs = new ArrayList<>();
        expectedDogs.addAll(Arrays.asList(max, annie));

        when(dogRepository.findAll()).thenReturn(expectedDogs);

        // act
        MvcResult response = mockMvc.perform(get("/api/dogs/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(dogRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedDogs);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_dog() throws Exception {
        // arrange

        Dog annie = Dog.builder()
                .name("Annie")
                .breed("Poodle")
                .gender("Female")
                .build();

        when(dogRepository.save(eq(annie))).thenReturn(annie);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/dogs/post?name=Annie&breed=Poodle&gender=Female")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(dogRepository, times(1)).save(annie);
        String expectedJson = mapper.writeValueAsString(annie);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_dog() throws Exception {
        // arrange

        Dog annie = Dog.builder()
                .name("Annie")
                .breed("Poodle")
                .gender("Female")
                .build();

        when(dogRepository.findById(eq("Annie"))).thenReturn(Optional.of(annie));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/dogs?name=Annie")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(dogRepository, times(1)).findById("Annie");
        verify(dogRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("Dog with id Annie deleted", json.get("message"));
    }

@WithMockUser(roles = { "ADMIN", "USER" })
@Test
public void admin_tries_to_delete_non_existant_dog_and_gets_right_error_message()
throws Exception {
// arrange

when(dogRepository.findById(eq("dne"))).thenReturn(Optional.empty());

// act
MvcResult response = mockMvc.perform(
delete("/api/dogs?name=dne")
                .with(csrf()))
.andExpect(status().isNotFound()).andReturn();

// assert
verify(dogRepository, times(1)).findById("dne");
Map<String, Object> json = responseToJson(response);
assertEquals("Dog with id dne not found", json.get("message"));
}

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_dog() throws Exception {
        // arrange

        Dog annieOriginal = Dog.builder()
                .name("Annie")
                .breed("Poodle")
                .gender("Female")
                .build();

        Dog annieEdited = Dog.builder()
                .name("Annie")
                .breed("Yorkie")
                .gender("Female")
                .build();

        String requestBody = mapper.writeValueAsString(annieEdited);

        when(dogRepository.findById(eq("Annie"))).thenReturn(Optional.of(annieOriginal));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/dogs?name=Annie")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(dogRepository, times(1)).findById("Annie");
        verify(dogRepository, times(1)).save(annieEdited); // should be saved with updated info
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_dog_that_does_not_exist() throws Exception {
        // arrange

        Dog annieEdited = Dog.builder()
                .name("Annie")
                .breed("Yorkie")
                .gender("Female")
                .build();

        String requestBody = mapper.writeValueAsString(annieEdited);

        when(dogRepository.findById(eq("Annie"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/dogs?name=Annie")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(dogRepository, times(1)).findById("Annie");
        Map<String, Object> json = responseToJson(response);
        assertEquals("Dog with id Annie not found", json.get("message"));

    }
}
