
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";

const emptyProperty = {
  title: "",
  description: "",
  address: "",
  featured: false,
  price: "",
  listing_type: "buy",
  property_type: "Apartment",
  city: "",
  locality: "",
  bedrooms: 2,
  bathrooms: 2,
  area_sqft: "",
  image_urls: [],
  amenities: [],
  status: "draft",
};

const formatPrice = (price, listingType) =>
  `₹${Number(price).toLocaleString("en-IN")}${
    listingType === "rent" ? "/month" : ""
  }`;

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProperty);
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!active) return;

      if (sessionError) {
        setError(sessionError.message);
        setChecking(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await verifyAdmin(data.session.user);
      } else {
        setChecking(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
          setError("");
          setNotice("");
        }

        setSession(nextSession);

        if (!nextSession) {
          setAuthorized(false);
          setProperties([]);
          setChecking(false);
        }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function verifyAdmin(user) {
    setChecking(true);
    setError("");

    const { data, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !data) {
      setAuthorized(false);
      setError(
        adminError
          ? `Could not verify admin access: ${adminError.message}`
          : "This account is not authorized to manage properties."
      );
      setChecking(false);
      return;
    }

    setAuthorized(true);
    setChecking(false);
    await loadProperties();
  }

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setSession(data.session);
    await verifyAdmin(data.user);
    setLoading(false);
  }
  async function sendPasswordReset(event) {
    event.preventDefault();
    setResetLoading(true);
    setError("");
    setNotice("");

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin?reset-password=true`,
      });

    if (resetError) {
      setError(resetError.message);
    } else {
      setNotice(
        "If an account exists for this email, you will receive a password reset link."
      );
    }

    setResetLoading(false);
  }

  async function logout() {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
      return;
    }

    setSession(null);
    setAuthorized(false);
    setProperties([]);
    setError("");
    setNotice("");
  }
  
async function updatePassword(event) {
  event.preventDefault();
  setError("");
  setNotice("");

  if (newPassword.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    setError(updateError.message);
  } else {
    setNotice("Password updated successfully. You can now sign in with your new password.");

    setIsRecovery(false);
    setNewPassword("");
    setConfirmPassword("");

    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(false);
  }

  setLoading(false);
}

  async function loadProperties() {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
    } else {
      setProperties(data ?? []);
    }

    setLoading(false);
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...emptyProperty,
      image_urls: [],
      amenities: [],
    });
    setAmenitiesInput("");
    setPhotos([]);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(property) {
    setEditingId(property.id);

    setForm({
      ...emptyProperty,
      ...property,
      price: String(property.price),
      area_sqft: property.area_sqft ?? "",
      image_urls: property.image_urls ?? [],
      amenities: property.amenities ?? [],
    });

    setAmenitiesInput((property.amenities ?? []).join(", "));
    setPhotos([]);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function uploadPhotos(propertyId) {
    const uploadedUrls = [];

    for (const photo of photos) {
      const extension =
        photo.name.split(".").pop()?.toLowerCase() || "jpg";

      const path = `${propertyId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("property_images")
        .upload(path, photo, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("property_images")
        .getPublicUrl(path);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  async function saveProperty(event) {
    event.preventDefault();

    if (!session?.user || !authorized) return;

    const price = Number(form.price);
    const area =
      form.area_sqft === "" ? null : Number(form.area_sqft);

    if (
      !form.title.trim() ||
      !form.city.trim() ||
      !form.locality.trim()
    ) {
      setError("Title, city, and locality are required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid, non-negative price.");
      return;
    }

    if (
      area !== null &&
      (!Number.isFinite(area) || area < 0)
    ) {
      setError("Enter a valid property area.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    let propertyId = editingId;

    try {
      const amenities = amenitiesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        description: (form.description ?? "").trim(),
        amenities,
        address: form.address.trim(),
        featured: form.featured,
        price,
        listing_type: form.listing_type,
        property_type: form.property_type,
        city: form.city.trim(),
        locality: form.locality.trim(),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area_sqft: area,
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      if (!editingId) {
        const { data, error: insertError } = await supabase
          .from("properties")
          .insert(payload)
          .select("id")
          .single();

        if (insertError) throw insertError;

        propertyId = data.id;
      } else {
        const { error: updateError } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;
      }

      const uploadedUrls = await uploadPhotos(propertyId);

      // Preserve existing photos except those explicitly removed.
      const currentUrls = form.image_urls ?? [];

      if (uploadedUrls.length > 0 || !editingId) {
        const { error: imageUpdateError } = await supabase
          .from("properties")
          .update({
            image_urls: [...currentUrls, ...uploadedUrls],
          })
          .eq("id", propertyId);

        if (imageUpdateError) throw imageUpdateError;
      } else if (editingId) {
        // Save photo removals made in the edit form.
        const originalProperty = properties.find(
          (property) => property.id === editingId
        );

        const originalUrls = originalProperty?.image_urls ?? [];

        const removedUrls = originalUrls.filter(
          (url) => !currentUrls.includes(url)
        );

        if (removedUrls.length > 0) {
          const marker = "/object/public/property_images/";

          const paths = removedUrls
            .map((url) => {
              const index = url.indexOf(marker);

              return index === -1
                ? null
                : decodeURIComponent(
                    url.slice(index + marker.length)
                  );
            })
            .filter(Boolean);

          if (paths.length > 0) {
            const { error: storageError } = await supabase.storage
              .from("property_images")
              .remove(paths);

            if (storageError) throw storageError;
          }

          const { error: imageUpdateError } = await supabase
            .from("properties")
            .update({ image_urls: currentUrls })
            .eq("id", propertyId);

          if (imageUpdateError) throw imageUpdateError;
        }
      }

      setFormOpen(false);
      setPhotos([]);
      setNotice(editingId ? "Property updated." : "Property created.");

      await loadProperties();
    } catch (saveError) {
      setError(saveError.message || "Could not save the property.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProperty(property) {
    const confirmed = window.confirm(
      `Permanently delete "${property.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const urls = property.image_urls ?? [];
      const marker = "/object/public/property_images/";

      const paths = urls
        .map((url) => {
          const index = url.indexOf(marker);

          return index === -1
            ? null
            : decodeURIComponent(url.slice(index + marker.length));
        })
        .filter(Boolean);

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("property_images")
          .remove(paths);

        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);

      if (deleteError) throw deleteError;

      setNotice("Property deleted.");
      await loadProperties();
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete the property.");
    }
  }

  const visibleProperties = properties.filter((property) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      [
        property.title,
        property.city,
        property.locality,
        property.property_type,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

    return (
      matchesSearch &&
      (statusFilter === "all" || property.status === statusFilter)
    );
  });

  if (checking) {
    return (
      <main className="admin-shell">
        <p>Checking admin access…</p>
      </main>
    );
  }

  
if (isRecovery) {
  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={updatePassword}>
        <p className="admin-eyebrow">PROPERTY MANAGEMENT</p>
        <h1>Set new password</h1>
        <p>Choose a new password for your administrator account.</p>

        {error && (
          <div className="admin-alert error">{error}</div>
        )}

        {notice && (
          <div className="admin-alert success">{notice}</div>
        )}

        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={6}
          required
        />

        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          required
        />

        <button className="admin-primary" disabled={loading}>
          {loading ? "Updating password…" : "Update password"}
        </button>
      </form>
    </main>
  );
}

  if (!session || !authorized) {
    return (
      <main className="admin-login-page">
        <form
          className="admin-login-card"
          onSubmit={forgotPassword ? sendPasswordReset : login}
        >
          <p className="admin-eyebrow">PROPERTY MANAGEMENT</p>

          <h1>{forgotPassword ? "Reset password" : "Admin login"}</h1>

          <p>
            {forgotPassword
              ? "Enter your admin email and we'll send you a password reset link."
              : "Sign in with your authorized administrator account."}
          </p>

          {error && (
            <div className="admin-alert error">{error}</div>
          )}

          {notice && (
            <div className="admin-alert">
              {notice}
            </div>
          )}

          {forgotPassword ? (
            <>
              <label htmlFor="reset-email">Admin email</label>
              <input
                id="reset-email"
                name="resetEmail"
                type="email"
                autoComplete="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="Enter your admin email"
                required
              />

              <button
                className="admin-primary"
                type="submit"
                disabled={resetLoading}
              >
                {resetLoading ? "Sending link…" : "Send reset link"}
              </button>

              <button
                type="button"
                className="admin-forgot-link"
                onClick={() => {
                  setForgotPassword(false);
                  setError("");
                  setNotice("");
                }}
              >
                Back to login
              </button>
            </>
          ) : (
            <>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
              />

              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-forgot-link"
                onClick={() => {
                  setForgotPassword(true);
                  setResetEmail("");
                  setError("");
                  setNotice("");
                }}
              >
                Forgot password?
              </button>

              <button className="admin-primary" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </>
          )}
        </form>
      </main>
    );
  }


  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">PROPERTY MANAGEMENT</p>
          <h1>Listings</h1>
          <p>Manage the properties displayed on your website.</p>
        </div>

        <button className="admin-secondary" onClick={logout}>
          Sign out
        </button>
      </header>

      {error && <div className="admin-alert error">{error}</div>}
      {notice && <div className="admin-alert success">{notice}</div>}

      <section className="admin-stats">
        <div>
          <span>Total listings</span>
          <strong>{properties.length}</strong>
        </div>

        <div>
          <span>Published</span>
          <strong>
            {properties.filter((p) => p.status === "published").length}
          </strong>
        </div>

        <div>
          <span>Drafts</span>
          <strong>
            {properties.filter((p) => p.status === "draft").length}
          </strong>
        </div>
      </section>

      <section className="admin-toolbar">
        <input
          aria-label="Search properties"
          placeholder="Search title, city, locality…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="archived">Archived</option>
        </select>

        <button className="admin-primary" onClick={openCreateForm}>
          + Add property
        </button>
      </section>

      {formOpen && (
        <section className="admin-form-card">
          <div className="admin-form-heading">
            <h2>{editingId ? "Edit property" : "Add property"}</h2>

            <button
              type="button"
              className="admin-secondary"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={saveProperty} className="property-form">
            <label>
              Property title *
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                maxLength={180}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={updateField}
                rows={4}
              />
            </label>
            <label>
              Address *
              <input 
              type="text" 
              name="address"
              value={form.address ?? ""}
              onChange={updateField}
              required
              />
            </label>
            <label>
              Amenities
              <input
                name="amenities"
                type="text"
                value={amenitiesInput}
                onChange={(event) =>
                  setAmenitiesInput(event.target.value)
                }
                placeholder="Parking, Swimming Pool, Gym, Lift, 24/7 Security"
              />
              <small>Separate amenities with commas.</small>
            </label>
          <label className="featured-toggle">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured ?? false}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  featured: e.target.checked,
                }))
              }
            />

            <span>
              Feature Property
              <small>Highlight this property on the homepage</small>
            </span>
          </label>
            <div className="property-form-grid">
              <label>
                Price (₹) *
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Listing type
                <select
                  name="listing_type"
                  value={form.listing_type}
                  onChange={updateField}
                >
                  <option value="buy">For sale</option>
                  <option value="rent">For rent</option>
                </select>
              </label>

              <label>
                Property type
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={updateField}
                >
                  {[
                    "Apartment",
                    "Villa",
                    "Independent House",
                    "Plot",
                    "Commercial",
                    "Studio",
                    "Penthouse",
                    "Other",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                City *
                <input
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Locality *
                <input
                  name="locality"
                  value={form.locality}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Bedrooms
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={updateField}
                />
              </label>

              <label>
                Bathrooms
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={updateField}
                />
              </label>

              <label>
                Area (sq. ft.)
                <input
                  name="area_sqft"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.area_sqft}
                  onChange={updateField}
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>

            {form.image_urls?.length > 0 && (
              <div>
                <p>Current photos</p>

                <div className="admin-photo-grid">
                  {form.image_urls.map((url) => (
                    <div className="admin-photo" key={url}>
                      <img src={url} alt="Property" />

                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            image_urls: current.image_urls.filter(
                              (image) => image !== url
                            ),
                          }))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label>
              Upload photos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) =>
                  setPhotos(Array.from(event.target.files ?? []))
                }
              />
            </label>

            {photos.length > 0 && (
              <p>{photos.length} new photo(s) selected</p>
            )}

            <button className="admin-primary" disabled={saving}>
              {saving
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Create property"}
            </button>
          </form>
        </section>
      )}

      <section className="admin-table-card">
        <div className="admin-table-heading">
          <h2>All properties</h2>

          <button
            className="admin-secondary"
            onClick={loadProperties}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleProperties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <div className="admin-property-cell">
                      {property.image_urls?.[0] ? (
                        <img src={property.image_urls[0]} alt="" />
                      ) : (
                        <div className="admin-no-photo">No photo</div>
                      )}

                      <div>
                        <strong>{property.title}</strong>
                        <small>{property.property_type}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {property.locality}, {property.city}
                  </td>

                  <td>
                    {formatPrice(property.price, property.listing_type)}
                  </td>

                  <td>
                    {property.listing_type === "buy" ? "Sale" : "Rent"}
                  </td>

                  <td>
                    <span
                      className={`admin-status ${property.status}`}
                    >
                      {property.status}
                    </span>
                  </td>

                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-secondary"
                        onClick={() => openEditForm(property)}
                      >
                        Edit
                      </button>

                      <button
                        className="admin-danger"
                        onClick={() => deleteProperty(property)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleProperties.length === 0 && (
                <tr>
                  <td colSpan="6" className="admin-empty">
                    {loading
                      ? "Loading properties…"
                      : "No properties found. Add your first listing."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
