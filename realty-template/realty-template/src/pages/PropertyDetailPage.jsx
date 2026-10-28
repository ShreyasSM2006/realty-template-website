import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { formatPrice } from "../utils/formatPrice.js";
import { telUrl, propertyEnquiryMessage } from "../utils/whatsapp.js";
import { useMeta } from "../utils/useMeta.js";
import PropertyGallery from "../components/properties/PropertyGallery.jsx";
import PropertyGrid from "../components/properties/PropertyGrid.jsx";
import { STATUS_LABELS } from "../components/properties/PropertyCard.jsx";
import WhatsAppButton from "../components/common/WhatsAppButton.jsx";
import Button from "../components/common/Button.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProperty() {
      setLoading(true);
      setError("");
      setProperty(null);
      setRelated([]);

      try {
        // Fetch the selected published property from Supabase.
        const { data, error: fetchError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .eq("status", "published")
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!active) return;

        if (!data) {
          setProperty(null);
          return;
        }

        // Prefer the full saved address. Older properties fall back to locality and city.
        const mappedProperty = {
          ...data,
          listingPurpose: data.listing_type,
          propertyType: data.property_type,
          areaSqFt: data.area_sqft,
          images: data.image_urls ?? [],
          amenities: data.amenities ?? [],
          address:
            data.address?.trim() ||
            [data.locality, data.city].filter(Boolean).join(", "),
          status: data.status === "published" ? "available" : data.status,
        };

        setProperty(mappedProperty);

        // Fetch related published properties.
        const { data: relatedData, error: relatedError } = await supabase
          .from("properties")
          .select("*")
          .eq("status", "published")
          .neq("id", data.id)
          .order("created_at", { ascending: false });

        if (relatedError) throw relatedError;
        if (!active) return;

        const mappedRelated = (relatedData ?? [])
          .filter(
            (item) =>
              item.locality === data.locality ||
              item.property_type === data.property_type
          )
          .slice(0, 3)
          .map((item) => ({
            ...item,
            listingPurpose: item.listing_type,
            propertyType: item.property_type,
            areaSqFt: item.area_sqft,
            images: item.image_urls ?? [],
            amenities: item.amenities ?? [],
            address:
              item.address?.trim() ||
              [item.locality, item.city].filter(Boolean).join(", "),
            status: "available",
          }));

        setRelated(mappedRelated);
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Could not load this property.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProperty();

    return () => {
      active = false;
    };
  }, [id]);

  useMeta(
    property
      ? {
          title: property.title,
          description: property.description?.slice(0, 160),
          image: property.images?.[0],
          path: `/properties/${property.id}`,
        }
      : { title: "Property details" }
  );

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading property details...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <Link to="/properties" className="back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to listings
          </Link>
          <p role="alert">{error}</p>
          <Button href="/properties" variant="outline">
            Browse properties
          </Button>
        </div>
      </section>
    );
  }

  if (!property) {
    return (
      <NotFoundPage
        title="Property not found"
        message="This listing does not exist, is unpublished, or is no longer available."
      />
    );
  }

  const p = property;
  const tel = telUrl();

  const specs = [
    ["Address", p.address],
    ["Type", p.propertyType],
    ["Listing", p.listingPurpose === "rent" ? "For rent" : "For sale"],
    ["Availability", STATUS_LABELS[p.status] || p.status],
    p.bedrooms != null && ["Bedrooms", p.bedrooms],
    p.bathrooms != null && ["Bathrooms", p.bathrooms],
    p.areaSqFt != null && ["Area", `${p.areaSqFt} sq ft`],
  ].filter((item) => item && item[1] != null && item[1] !== "");

  return (
    <article className="section">
      <div className="container">
        <Link to="/properties" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to listings
        </Link>

        <div className="detail-grid">
          <PropertyGallery images={p.images} title={p.title} />

          <div className="detail-info">
            <p className="property-meta">
              <MapPin size={14} aria-hidden="true" />
              {[p.locality, p.city].filter(Boolean).join(", ")}
            </p>

            <h1>{p.title}</h1>

            <p className="property-price big">
              {formatPrice(p.price, p.listingPurpose)}
            </p>

            <div className="hero-actions">
              <WhatsAppButton message={propertyEnquiryMessage(p)}>
                Enquire on WhatsApp
              </WhatsAppButton>

              {tel && (
                <Button href={tel} variant="outline">
                  <Phone size={18} aria-hidden="true" />
                  Call
                </Button>
              )}
            </div>

            <dl className="spec-table">
              {specs.map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd> {value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {p.description && (
          <section className="detail-block">
            <h2>Description</h2>
            <p>{p.description}</p>
          </section>
        )}

        {p.amenities?.length > 0 && (
          <section className="detail-block">
            <h2>Amenities</h2>
            <ul className="check-list">
              {p.amenities.map((amenity, index) => (
                <li key={`${amenity}-${index}`}>{amenity}</li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="detail-block">
            <h2>Related properties</h2>
            <PropertyGrid properties={related} />
          </section>
        )}
      </div>
    </article>
  );
}
