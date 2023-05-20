package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Restaurant;
import edu.ucsb.cs156.example.repositories.RestaurantRepository;

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

@WebMvcTest(controllers = RestaurantController.class)
@Import(TestConfig.class)
public class RestaurantControllerTests extends ControllerTestCase {

    @MockBean
    RestaurantRepository restaurantRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/Restaurant/admin/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/Restaurant/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/Restaurant/all"))
                .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/Restaurant?id=1"))
                .andExpect(status().is(403)); // logged out users can't get by id
    }

    // Authorization tests for /api/Restaurant/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/Restaurant/post"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/Restaurant/post"))
                .andExpect(status().is(403)); // only admins can post
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange

        Restaurant restaurant = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 1")
                .build();

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.of(restaurant));

        // act
        MvcResult response = mockMvc.perform(get("/api/Restaurant?id=1"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(restaurantRepository, times(1)).findById(eq(1L));
        String expectedJson = mapper.writeValueAsString(restaurant);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/Restaurant?id=1"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(restaurantRepository, times(1)).findById(eq(1L));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Restaurant with id 1 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_restaurants() throws Exception {

        // arrange

        Restaurant restaurant1 = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 1")
                .build();

        Restaurant restaurant2 = Restaurant.builder()
                .name("Restaurant 2")
                .description("Description 2")
                .build();

        ArrayList<Restaurant> expectedRestaurants = new ArrayList<>();
        expectedRestaurants.addAll(Arrays.asList(restaurant1, restaurant2));

        when(restaurantRepository.findAll()).thenReturn(expectedRestaurants);

        // act
        MvcResult response = mockMvc.perform(get("/api/Restaurant/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(restaurantRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedRestaurants);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_restaurant() throws Exception {
        // arrange

        Restaurant restaurant = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 1")
                .build();

        when(restaurantRepository.save(eq(restaurant))).thenReturn(restaurant);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/Restaurant/post?name=Restaurant 1&description=Description 1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(restaurantRepository, times(1)).save(restaurant);
        String expectedJson = mapper.writeValueAsString(restaurant);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_restaurant() throws Exception {
        // arrange

        Restaurant restaurant = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 1")
                .build();

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.of(restaurant));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/Restaurant?id=1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(restaurantRepository, times(1)).findById(1L);
        verify(restaurantRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("Restaurant with id 1 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existent_restaurant_and_gets_right_error_message()
            throws Exception {
        // arrange

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/Restaurant?id=1")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(restaurantRepository, times(1)).findById(1L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("Restaurant with id 1 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_restaurant() throws Exception {
        // arrange

        Restaurant restaurantOriginal = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 1")
                .build();

        Restaurant restaurantEdited = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 2")
                .build();

        String requestBody = mapper.writeValueAsString(restaurantEdited);

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.of(restaurantOriginal));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/Restaurant?id=1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(restaurantRepository, times(1)).findById(1L);
        verify(restaurantRepository, times(1)).save(restaurantEdited); // should be saved with updated info
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_restaurant_that_does_not_exist() throws Exception {
        // arrange

        Restaurant restaurantEdited = Restaurant.builder()
                .name("Restaurant 1")
                .description("Description 2")
                .build();

        String requestBody = mapper.writeValueAsString(restaurantEdited);

        when(restaurantRepository.findById(eq(1L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/Restaurant?id=1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(restaurantRepository, times(1)).findById(1L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("Restaurant with id 1 not found", json.get("message"));

    }
}
