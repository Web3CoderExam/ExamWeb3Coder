export async function verifyUser(email, password) {
    // Pour l'instant, on utilise tes données de test
    // Plus tard, on utilisera getDb() pour chercher dans PostgreSQL
    const mockUsers = [
        { id: 1, email: "ben@hei.mg", password: "password123", name: "Ben", role: "admin" }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}