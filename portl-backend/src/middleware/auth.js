"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyJWT = void 0;
const express_1 = require("express");
const supabase_1 = require("../services/supabase");
const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid Authorization header' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify token with Supabase
        const { data: { user }, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
            return;
        }
        // Fetch custom user details from our users table
        const { data: userData, error: userError } = await supabase_1.supabaseAdmin
            .from('users')
            .select('role, society_id')
            .eq('id', user.id)
            .single();
        if (userError || !userData) {
            res.status(401).json({ error: 'User profile not found in database' });
            return;
        }
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: userData.role,
            society_id: userData.society_id
        };
        next();
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
exports.verifyJWT = verifyJWT;
// Middleware to enforce specific roles
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            res.status(401).json({ error: 'Unauthorized: No role found' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map