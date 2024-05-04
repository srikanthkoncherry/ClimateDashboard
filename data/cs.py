import pandas as pd

# Load the data
df = pd.read_csv('data_1.csv')

# Keep only the 'Country', 'Date', and 'Value' columns
df = df[['Country', 'Date', 'Value']]

# Parse the date
df['Date'] = pd.to_datetime(df['Date'], format='%YM%m')

# Condense the data to yearly Values
df['year'] = df['Date'].dt.year
df = df.groupby(['Country', 'year'])['Value'].mean().reset_index()

# Write the result to a new CSV file
df.to_csv('condensed_data.csv', index=False)