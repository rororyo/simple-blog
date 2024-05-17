PGDMP                         |            Simple Blog    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    24899    Simple Blog    DATABASE     �   CREATE DATABASE "Simple Blog" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "Simple Blog";
                postgres    false            �            1259    24935    category    TABLE     R   CREATE TABLE public.category (
    id integer NOT NULL,
    category_name text
);
    DROP TABLE public.category;
       public         heap    postgres    false            �            1259    24934    category_id_category_seq    SEQUENCE     �   CREATE SEQUENCE public.category_id_category_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.category_id_category_seq;
       public          postgres    false    217                       0    0    category_id_category_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.category_id_category_seq OWNED BY public.category.id;
          public          postgres    false    216            �            1259    24944    posts    TABLE     �   CREATE TABLE public.posts (
    id integer NOT NULL,
    category_id integer,
    title text,
    picture text,
    post_content text,
    author text,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.posts;
       public         heap    postgres    false            �            1259    24943    posts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.posts_id_seq;
       public          postgres    false    219                       0    0    posts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
          public          postgres    false    218            �            1259    24901    users    TABLE     i   CREATE TABLE public.users (
    id integer NOT NULL,
    email text,
    password text,
    role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    24900    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214            p           2604    24938    category id    DEFAULT     s   ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_category_seq'::regclass);
 :   ALTER TABLE public.category ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            q           2604    24947    posts id    DEFAULT     d   ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);
 7   ALTER TABLE public.posts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            o           2604    24904    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215                      0    24935    category 
   TABLE DATA                 public          postgres    false    217   �                 0    24944    posts 
   TABLE DATA                 public          postgres    false    219   �       	          0    24901    users 
   TABLE DATA                 public          postgres    false    215   �"                  0    0    category_id_category_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.category_id_category_seq', 12, true);
          public          postgres    false    216                       0    0    posts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.posts_id_seq', 11, true);
          public          postgres    false    218                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public          postgres    false    214            v           2606    24942    category category_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.category DROP CONSTRAINT category_pkey;
       public            postgres    false    217            x           2606    24952    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    219            t           2606    24908    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215            y           2606    24953    posts posts_id_category_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id_category_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);
 F   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_id_category_fkey;
       public          postgres    false    219    217    3190               �   x��ҽ
�0��ݫ�6�4��N�jH5v-�R#j�}u�^
�x��,/eix@��о���Ti������|*n�$Sp��Py�m��v�38�8s`\Ĕ]�����:�V_MxdL�@�gZ�Um}3鱒z��턧���a���Y�Cf2����� 5�U�           x��X�n7��?pV��r��-iV�N�R&V�5�UT7��b�E��?�^�J!�`2���r?X�}�{�a��}|�˃��{��߷��ft�x��J�ҩ��_?��]�*1��yK/��Smz�zW	����J4x�Sm�k^�������x��Ī/���F'^�]���b��l�����j��%?X����O������r��p�n�U����;ј�X1j'd�p>U�v�уk��j���wN�N���]m�,-?ɶգh�^Y#t/d�?{��o����	�Za�U�݈δ�L+��D'��/���L��p��Q��Gg*q���ꑣ�<h~�W5Ў{�"�Q5�E�}o�8I��XŬ�����Q8�(`��kl�L�">���תm鹓vR	�����6�����������#�A�;�A+$7`tV�Wꀨ�!l��:�s��iĆ�*�G���^!h:Ib' ��u�{'�?h��b$��m/g�[%�V�܆^�:f�/e�3��ę��ֱT���P���+.b��O��i*rħ�^��c�ȱ��5:1��Z�F�J���k�!e�j���8��⻋�~:y7���H�R���= p\	n\P��Q�8��c��=�#���E���n?[�F�\~�1�arp9_	U^^:�t8[�@sT������w/��aZhd�ߝG��PGx|roQ��N�Iu�E�	�e4.���Ɛ+�x+����6���] F��Vqde���}*'��z��>1j���N�/7�zl羕�)��%��#c�`�I7�N	��3 HӾ�Lc3�����+�9T:����c�l�����{MD��%}��&0��hC�k�I(7}0���}�,t�[�g�h��pP[�#�[渙�bϠ�#YBpz����IRf�X{4=j((�U��C��0V#�������+�	��B^�sa�21u�4��r��� &"9�%�H�H�����B���R�`fw�y�� 9�<��w2$�v�������/�uFL`��*��S��ȍ��B�h��9L�a��}��4��B^��0�O�t����T犋�����#��|�g4cR��D6�/��?	��ړ@Da�@5���>A�=�HE����B�\���@��Ԟ2Z�4�rC��Ł���7����X��*Z:;U5�(Oѡ<����קI��E�.:g��F��wz�'��+�@.0F�@~� ��/x=�d².��G�h4M�.�z���
�iK�Cs�|ZưA(��y�T't.+��ۓƣ��5PT���d(2��W�z9_�_�7�k�\^/����l;�\.W/^��;����������������^��w��e��?��F��^>砷����Uc�ѷF6g�|v�g�|v�g��皉��;�^��_��­����|���w��]���H�<���C?���g�n�ٮ6Y���ū�X��ߒ6�`b����_� ޅ�ϧ�ad�LL�3)��Tqn��J��2I`�TX�Ҷ�e��Ʌ�`��3�L�$(ބ#��E���$��q���A�ٴ<\9����% ����LG�p �N*�D1�w�"�i-;��1Q��S~:��^��w���?� �"�GS\<D۴Ņ�0�F%`�kb)4>B7�f��E�?���}�8��b�E7���/�FM�������4t����O��G��l��`E�n��3��Y���p�'��t�c����~�.���n+
�´���2H|�O�.�x�U��ƫMmn�"Ԗ�C�̳HS���.�Ln���0ٷ�	���~`��b�� d��y*�<�d!��X��7�-K�=�^,w
%a�lr7�A���v��fɤȴC�a$�X0*�d�3�l�ؔ�x�}.y_
 �DE��4�E��[n����ns��ζ��r����o1��1>�A,��YO����]nv�u��Y���w������,~Q�������r3�\BH���o�/��iM'���?w�\,W�M���Y�βw����e�,{��η��,g���j��ٻ��'����      	   3  x����n�@��O1mbE������
ޖ�L��3)ҧ�6��tѤ��,�ɟ|9��:EȪ#g'�*IQ�.�{��xd�,kY����	l���Aw����)�P�2���$��I������=�Z�c�����\)�(�����ւ7̘Ʀ49RŸq��bׯ���X���� y>t"0 
�9D/�-���?��{�Y��@������5�jg*�׷M(m����&8/2EsE:�Rgy�GR��^�~��k>��뇅��}@+�f���5XKݣ�M�~>�{cm-=u�'ͯЭ�'ͫ�     