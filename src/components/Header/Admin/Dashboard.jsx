import React from "react";

// This component acts as the mainframe for Admin controls. It should have access to view the database (products, users, orders, and reviews), as well as create, edit, or delete products, view user information, create new categories, adjust inventory, change order status, promote users to admin status, or delete users(I'm not sure if this is meant to be block users from creating new accounts as well, or simply deleting users from the database), trigger password resets across all users, offer promo codes, and view key performance indicators to make good decisions for their business. This component can be broken down into smaller components or placed all in this file, but this will act as the parent file for rendering all of these features.
export const Dashboard = () => {
  return (
    <div>
      <h1>This is the dashboard</h1>
    </div>
  );
};