
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
# [(k_length, k_time, k_vertical_distance, traffic_split),..]
# traffic_split is how % trips use this version of path. Sum traffic split must be 1.
cost = [(1, 0, 0, 1)] # this setting means: only length cost, all trip use this path

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
# e.g age category age_00_05 can travel to ["amenities","shop","home"] type zones
age_category_rules = [["amenities","shop","home"],
                      ["amenities","shop","home"],
                      ["amenities", "shop", "home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"],
                      ["amenities", "shop","home"]]