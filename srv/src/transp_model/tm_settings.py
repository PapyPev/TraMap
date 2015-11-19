
# compute traffic for
#transpotation_type = "walking"
transpotation_type = "cycling"
#transpotation_type = "driver"

# area name for transportation modeling (settings for this area is in table "general_area_information")
area_name_for_modeling = "pokus"

# enable combination for zone types (e.g from type "home" you can travel to "shop" and "amenities")
enable_type_combination = { "shop":         ["home"],
                            "home":         ["shop", "amenities"],
                            "amenities":    ["home"]
                            }
# cost settings for multi-path (count_traffic method)
# [(k_length, k_time, k_vertical_distance),..]
cost = [(1, 0, 1)]

# column name for speed for transpotation modeling
speed = "speed_bike"

# list of age_category column names
age_category = ["age_00_05",
              "age_06_11",
              "age_12_14",
              "age_15_17",
              "age_18_29",
              "age_30_44",
              "age_45_64",
              "age_65_79",
              "age_80_99" ]

#enable destination zones type (same index like previous variable)
age_category_rules = [["amenities","shop","home"],
                      ["amenities","shop","home"],
                      ["amenities", "shop", "home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"]]