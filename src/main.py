import pandas as pd

# Load the 2021 dataset from the specified path
df_2021 = pd.read_excel(r'C:\Users\Harkirat\OneDrive - TechNL\Desktop\TechNL\data\2021StudentApplications.xlsx')
df_2022 = pd.read_excel(r'C:\Users\Harkirat\OneDrive - TechNL\Desktop\TechNL\data\2022StudentApplications.xlsx')
df_2023 = pd.read_excel(r'C:\Users\Harkirat\OneDrive - TechNL\Desktop\TechNL\data\2023StudentApplications.xlsx')
df_2024 = pd.read_excel(r'C:\Users\Harkirat\OneDrive - TechNL\Desktop\TechNL\data\2024StudentApplications.xlsx')


# Display the first few rows to inspect the data
print(df_2021.head())
